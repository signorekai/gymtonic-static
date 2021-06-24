import React from 'react';
import { useGeneralSettings } from '@wpengine/headless/react';
import { usePost } from '@wpengine/headless/next';
import { Header, Hero, Footer, Layout } from '../components';

export default function Page(): JSX.Element {
  const post = usePost();
  const settings = useGeneralSettings();

  return (
    <Layout>
      <main className="content content-page">
        {post?.title && <Hero title={post?.title} />}
        <div className="wrap">
          {post && (
            <div>
              <div>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: post.content ?? '' }} />
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
