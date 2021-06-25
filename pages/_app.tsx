/* eslint-disable react/jsx-props-no-spreading */
import React, { createContext, useState } from 'react';
import { AppContext, AppInitialProps } from 'next/app';
import { HeadlessProvider } from '@wpengine/headless/react';
import 'normalize.css/normalize.css';
import 'scss/main.scss';
import Loader from 'components/Loader';

export type LoaderContextType = {
  // assetsToLoad: Array<HTMLElement>;
  // setAssetsToLoad: (value: any) => void;
  // addAssetsToLoad: (value: any) => void;
  showLoader: boolean;
  setShowLoader: (value: boolean) => void;
};

export const LoaderContext = createContext<LoaderContextType | boolean>(false);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App({
  Component,
  pageProps,
}: AppContext & AppInitialProps) {
  const [showLoader, setShowLoader] = useState(false);

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <HeadlessProvider pageProps={pageProps}>
      <LoaderContext.Provider value={{ showLoader, setShowLoader }}>
        <Loader />
        <Component {...pageProps} />
      </LoaderContext.Provider>
    </HeadlessProvider>
  );
}
