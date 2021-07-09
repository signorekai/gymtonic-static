import React from 'react';
import Link from 'next/link';
import Heading, { HeadingProps } from './Heading';

interface Props {
  posts: WPGraphQL.Post[] | undefined;
  intro?: string;
  id?: string;
  heading?: string;
  headingLevel?: HeadingProps['level'];
  postTitleLevel?: HeadingProps['level'];
  readMoreText?: string;
}

function Posts({
  posts,
  intro,
  heading,
  id,
  headingLevel = 'h1',
  postTitleLevel = 'h2',
  readMoreText = 'Read more',
}: Props): JSX.Element {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <section {...(id && { id })} />
  );
}

export default Posts;
