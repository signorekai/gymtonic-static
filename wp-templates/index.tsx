import React from 'react';
import { useGeneralSettings, usePosts } from '@wpengine/headless/react';
import Header from 'components/Header';
import Posts from 'components/Posts';

export default function Index(): JSX.Element {
  const posts = usePosts();
  const settings = useGeneralSettings();

  return (
    <>
      <main className="content content-index">
        <Posts posts={posts?.nodes} />
      </main>
    </>
  );
}
