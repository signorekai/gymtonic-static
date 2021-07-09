import React from 'react';
import { useGeneralSettings } from '@wpengine/headless/react';
import { usePost } from '@wpengine/headless/next';
import Header from 'components/Header';

export default function Single(): JSX.Element {
  const post = usePost();
  const settings = useGeneralSettings();

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
