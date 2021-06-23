/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { AppContext, AppInitialProps } from 'next/app';
import { HeadlessProvider } from '@wpengine/headless/react';
import { motion } from 'framer-motion';
import 'normalize.css/normalize.css';
import 'scss/main.scss';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App({
  Component,
  pageProps,
  router,
}: AppContext & AppInitialProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <HeadlessProvider pageProps={pageProps}>
      <motion.div
        key={router.asPath}
        initial="pageInitial"
        animate="pageAnimate"
        exit="pageInitial"
        transition={{ duration: 1.2 }}
        variants={{
          pageInitial: {
            opacity: 0,
          },
          pageAnimate: {
            opacity: 1,
          },
        }}>
        <Component {...pageProps} />
      </motion.div>
    </HeadlessProvider>
  );
}
