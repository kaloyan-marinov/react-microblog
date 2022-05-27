export default function App() {
  const post = {
    id: 1,
    text: 'Hello, world!',
    timestamp: 'a minute ago',
    author: {
      username: 'susan',
    },
  }

  return (
    <>
      <h1>Microblog</h1>
      <p>
        <b>{post.author.username}</b> &mdash; {post.timestamp}
        <br />
        {post.text}
      </p>
    </>
  );
}