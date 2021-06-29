import React, { useContext, useEffect } from 'react';
import { usePost } from '@wpengine/headless/next';
import withLayout from 'components/Layout';
import { LoaderContext, LoaderContextType } from 'pages/_app';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
// const useLoaderContext = (): LoaderContextType => useContext(LoaderContext);

function Page(): JSX.Element {
  const post = usePost();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { showLoader, setShowLoader }: LoaderContextType =
    useContext(LoaderContext);

  return (
    <main className="content content-page">
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
  );
}

export default withLayout(Page);
