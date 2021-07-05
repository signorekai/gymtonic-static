import React, { useContext } from 'react';
import { usePost } from '@wpengine/headless/next';
import withLayout from 'components/Layout';
import { LoaderContext, LoaderContextType } from 'pages/_app';

function Page(): JSX.Element {
  const post = usePost();

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

export default Page;
