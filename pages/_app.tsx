/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { AppContext, AppInitialProps } from 'next/app';
import { HeadlessProvider } from '@wpengine/headless/react';
import 'normalize.css/normalize.css';
import 'scss/main.scss';
import Loader from 'components/Loader';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App({
  Component,
  pageProps,
  router,
}: AppContext & AppInitialProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <HeadlessProvider pageProps={pageProps}>
      <Loader />
      <Component {...pageProps} />
    </HeadlessProvider>
  );
}
