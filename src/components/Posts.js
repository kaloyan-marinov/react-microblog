import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function Posts() {
  const [posts, setPosts] = useState();

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
      const response = await fetch(BASE_API_URL + "/api/feed");

      if (response.ok) {
        const results = await response.json();
        setPosts(results.data);
      } else {
        // To make this component robust,
        // it is also necessary to handle the case of the request failing.
        setPosts(null);
      }
    })();
  }, []);

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
              {posts.map((post) => {
                return (
                  <p key={post.id}>
                    <b>{post.author.username}</b> &mdash; {post.timestamp}
                    <br />
                    {post.text}
                  </p>
                );
              })}
            </>
          )}
        </>
      )}
    </>
  );
}
