import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useApi } from "../contexts/ApiProvider";
import Post from "./Post";

export default function Posts({ content }) {
  const [posts, setPosts] = useState();
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
      } else {
        // To make this component robust,
        // it is also necessary to handle the case of the request failing.
        setPosts(null);
      }
    })();
  }, [api, url]);

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
            </>
          )}
        </>
      )}
    </>
  );
}
