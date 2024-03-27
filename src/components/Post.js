import { memo } from "react";
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import TimeAgo from "./TimeAgo";

// Adding the `memo` function from React as a wrapper
// transparently replaces the original component
// with a version of it
// that is optimized to skip the render
// when it is invoked with the same inputs [= props and state variables] as the previous time.
//
// Q:
//    Should all components be memoized?
// A:
//    This is a difficult question to answer.
//
//    It is easy to visualize the performance improvements for components such as `Post`,
//    which are often re-rendered by React, just because the parent renders.
//
//    It is hard to say that
//    it is beneficial to memoize components
//    that do not render as often,
//    or that generally render with different inputs,
//    because the logic added by `memo()` also has a cost.
//
//    If you are interested in finding out
//    if applying `memo()` to a component makes your application render faster,
//    a specialized tool such as the profiler included in
//    the React Developer Tools plugin for Chrome or Firefox
//    should be used to take accurate measurements.
export default memo(function Post({ post }) {
  return (
    <Stack direction="horizontal" gap={3} className="Post">
      <Image
        src={post.author.avatar_url + "&s=48"}
        alt={post.author.username}
        roundedCircle
      />
      <div>
        <p>
          <Link to={"/user/" + post.author.username}>
            {post.author.username}
          </Link>
          &nbsp;&mdash;&nbsp;
          <TimeAgo isoDate={post.timestamp} />:
        </p>
        <p>{post.text}</p>
      </div>
    </Stack>
  );
});
