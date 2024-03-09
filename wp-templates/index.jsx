import React from 'react';
import { usePosts } from '@wpengine/headless/react';
import Posts from 'components/Posts';

export default function Index() {
  const posts = usePosts();

  return (
    <>
      <main className="content content-index">
        <Posts posts={posts?.nodes} />
      </main>
    </>
  );
}
