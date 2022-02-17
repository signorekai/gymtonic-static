/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { AppContext, AppInitialProps } from 'next/app';
import { HeadlessProvider } from '@wpengine/headless/react';
import ReactGA from 'react-ga';
import 'scss/main.scss';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App({
  Component,
  pageProps,
}: AppContext & AppInitialProps) {
  useEffect(() => {
    ReactGA.initialize(process.env.GOOGLE_ANALYTICS_KEY);
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <HeadlessProvider pageProps={pageProps}>
      <Component {...pageProps} />
    </HeadlessProvider>
  );
}
