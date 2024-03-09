/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { HeadlessProvider } from '@wpengine/headless/react';
import 'scss/main.scss';

export default function App({ Component, pageProps }) {
  return (
    <HeadlessProvider pageProps={pageProps}>
      <Component {...pageProps} />
    </HeadlessProvider>
  );
}
