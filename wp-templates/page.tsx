import React, { useContext, useEffect } from 'react';
import { usePost } from '@wpengine/headless/next';

import { LoaderContext, LoaderContextType } from 'pages/_app';
import { Hero, Layout } from '../components';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const useLoaderContext = (): LoaderContextType => useContext(LoaderContext);

export default function Page(): JSX.Element {
  const post = usePost();
  const { setShowLoader } = useLoaderContext();

  useEffect(() => {
    setShowLoader(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
