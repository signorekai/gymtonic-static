/* eslint-disable react/jsx-props-no-spreading */
import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import { AppContext, AppInitialProps } from 'next/app';
import { HeadlessProvider } from '@wpengine/headless/react';
import 'normalize.css/normalize.css';
import 'scss/main.scss';
import Loader from 'components/Loader';
import { useRouter } from 'next/router';
import MobileNav from 'components/MobileNav';

export interface ThemeContextType {
  // assetsToLoad: Array<HTMLElement>;
  // setAssetsToLoad: (value: any) => void;
  // addAssetsToLoad: (value: any) => void;
  showLoader: boolean;
  setShowLoader: Dispatch<SetStateAction<boolean>>;
  showMobileNav: boolean;
  setShowMobileNav: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ThemeContext = createContext<any>(null);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App({
  Component,
  pageProps,
}: AppContext & AppInitialProps) {
  const isTransitioning = useRef(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const router = useRouter();

  const handleStart = (url: string) => {
    // if (url.match(/about/).length === 0) {
    console.log('>>> start routechange', url);
    isTransitioning.current = true;
    setShowMobileNav(false);
    setShowLoader(true);
    // }
  };

  const handleComplete = (url: string) => {
    console.log('>>> complete routechange', url);
    isTransitioning.current = false;
    if (url !== '/') setShowLoader(false);
  };

  const handleSetShowLoader = (state: boolean) => {
    console.log('calling', state, isTransitioning.current);
    if (isTransitioning.current === false) {
      setShowLoader(state);
    }
  };

  useEffect(() => {
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <HeadlessProvider pageProps={pageProps}>
      <ThemeContext.Provider
        value={{
          showLoader,
          setShowLoader: handleSetShowLoader,
          showMobileNav,
          setShowMobileNav,
        }}>
        <Loader showLoader={showLoader} />
        <MobileNav />
        <Component {...pageProps} />
      </ThemeContext.Provider>
    </HeadlessProvider>
  );
}
