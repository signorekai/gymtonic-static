/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { AppContext, AppInitialProps } from 'next/app';
import { HeadlessProvider } from '@wpengine/headless/react';
import TagManager from 'react-gtm-module';
import 'scss/main.scss';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App({
  Component,
  pageProps,
}: AppContext & AppInitialProps) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    TagManager.initialize({
      gtmId: 'G-4WF6C39R6J',
    });
  }, []);
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <HeadlessProvider pageProps={pageProps}>
      <Component {...pageProps} />
    </HeadlessProvider>
  );
}
