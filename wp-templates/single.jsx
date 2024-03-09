import React from 'react';
import { usePost } from '@wpengine/headless/next';

export default function Single() {
  const post = usePost();

  return (
    <>
      <main className="content content-single">
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
    </>
  );
}
