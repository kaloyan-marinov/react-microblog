import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useApi } from "../contexts/ApiProvider";
import Post from "./Post";
import More from "./More";
import Write from "./Write";

// In React, renders are carried out in two phases.
// First, the output of the render functions is applied to _a virtual DOM_,
// which is an internal copy of the actual DOM from the browser.
// Once the components are rendered on the virtual DOM,
// the second phase invokes an efficient algorithm
// to merge the virtual DOM to the real DOM,
// and this is what makes the components visible on the page.
//
// Sometimes a component renders
// even though none of its inputs or state variables have changed.
//
// Unfortunately unnecessary renders are more common than most developers think.
// When a component renders, it returns a new JSX subtree.
// Any child components that are included in the returned JSX
// are forced to re-render
// even if they don't change,
// simply because they generated anew during the parent's render.
//
// As a general rule, you can say:
//    Unless measures are taken to prevent it,
//    each time a component renders,
//    any child components included in the JSX returned have to render too.
//
// In many cases the cost of these unnecessary renders is negligible,
// but this isn't always the case.
// Consider the following component,
// which has X instances of the `Post` component.
// If the user clicks the "More" button to obtain an additional `X` posts,
// all `X + X` posts will re-render.
export default function Posts({ content, write }) {
  const [posts, setPosts] = useState();
  const [pagination, setPagination] = useState();
  const api = useApi();

  const showPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

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
      {write && <Write showPost={showPost} />}
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
