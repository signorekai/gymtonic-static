import React from 'react';

function Posts({
  posts,
  intro,
  heading,
  id,
  headingLevel = 'h1',
  postTitleLevel = 'h2',
  readMoreText = 'Read more',
}) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <section {...(id && { id })} />
  );
}

export default Posts;
