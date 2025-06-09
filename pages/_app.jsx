/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { HeadlessProvider } from '@wpengine/headless/react';
import '../scss/main.scss';

export default function App({ Component, pageProps }) {
  console.log(`BUILT AT : ${process.env.PUBLIC_BUILD_TIME_START}`)
  return (
    <HeadlessProvider pageProps={pageProps}>
      <Component {...pageProps} />
    </HeadlessProvider>
  );
}
