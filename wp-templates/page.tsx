import React from 'react';
import { usePost } from '@wpengine/headless/next';

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
