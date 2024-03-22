import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useApi } from "../contexts/ApiProvider";
import Post from "./Post";
import More from "./More";

export default function Posts({ content }) {
  const [posts, setPosts] = useState();
  const [pagination, setPagination] = useState();
  const api = useApi();

  let url;
  switch (content) {
    case "feed":
    case undefined:
      url = "/feed";
      break;
    case "explore":
      url = "/posts";
      break;
    default:
      // Assume `content` to hold some user's `id`.
      url = `/users/${content}/posts`;
      break;
  }

  /*
  React requires that
  the function that is given as the argument to `useEffect()`
  should not be async.
  
  A commonly used trick
  to enable the use of `async` and `await` in side effect functions is
  to create an inner async function and immediately call it.
  This pattern is commonly referred as
  an Immediately Invoked Function Expression (IIFE).
  */
  useEffect(() => {
    (async () => {
      const response = await api.get(url);

      if (response.ok) {
        setPosts(response.body.data);
        setPagination(response.body.pagination);
      } else {
        // To make this component robust,
        // it is also necessary to handle the case of the request failing.
        setPosts(null);
      }
    })();
  }, [api, url]);

  const loadNextPage = async () => {
    const response = await api.get(url, {
      after: posts[posts.length - 1].timestamp,
    });

    if (response.ok) {
      setPosts([...posts, ...response.body.data]);
      setPagination(response.body.pagination);
    }
  };

  return (
    <>
      {posts === undefined ? (
        <Spinner animation="border" />
      ) : (
        <>
          {posts === null ? (
            <p>Could not retrieve blog posts.</p>
          ) : (
            <>
              {posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
              <More pagination={pagination} loadNextPage={loadNextPage} />
            </>
          )}
        </>
      )}
    </>
  );
}
