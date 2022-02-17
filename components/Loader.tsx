/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

import loading from 'assets/images/loading.gif';

const transition = { duration: 0.35, ease: [0.175, 0.85, 0.42, 0.96] };

interface Props {
  showLoader: boolean;
  setShowLoader(arg0: boolean): void;
}

function Loader({ showLoader, setShowLoader }: Props): JSX.Element {
  const router = useRouter();
  const animControls = useAnimation();
  const refShowLoader = useRef(false);

  const handleStart = (url: string) => {
    setShowLoader(true);
  };

  const handleComplete = (url: string) => {
    if (url !== '/') setShowLoader(false);
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

  useEffect(() => {
    async function changeLoaderState() {
      if (showLoader !== refShowLoader.current) {
        setShowLoader(showLoader);
        refShowLoader.current = showLoader;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`animating loader to ${showLoader ? 1 : 0}`);
        await animControls.start({
          opacity: showLoader ? 1 : 0,
          transition,
        });
        await animControls.start({
          pointerEvents: showLoader ? 'all' : 'none',
          transition: {
            duration: 0,
          },
        });
        // update state after this is done
      }
    }
    void changeLoaderState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLoader]);

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <motion.div
        key={router.asPath}
        initial={{ opacity: refShowLoader.current ? 1 : 0 }}
        animate={animControls}
        transition={transition}
        className="fixed z-70 top-0 left-0 w-full h-full pointer-events-none bg-pink flex flex-col justify-center items-center">
        <Image src={loading} alt="" width={126} height={222} />
      </motion.div>
    </AnimatePresence>
  );
}

export interface WithLoaderProps {
  setShowLoader: (arg0: boolean) => void;
  showLoader?: boolean;
}
interface LoaderState {
  showLoader: boolean;
}

function withLoader<T extends React.Component>(
  Component: React.ComponentType<T>,
): React.ComponentClass<T & WithLoaderProps> {
  return class extends React.Component<T & WithLoaderProps, LoaderState> {
    constructor(props: T & WithLoaderProps) {
      super(props);
      this.setShowLoader = this.setShowLoader.bind(this);

      this.state = {
        showLoader: true,
      };
    }

    setShowLoader(showLoader: boolean) {
      this.setState({ showLoader });
    }

    render() {
      const { showLoader } = this.state;
      return (
        <>
          <Loader showLoader={showLoader} setShowLoader={this.setShowLoader} />
          <Component
            {...this.props}
            showLoader={showLoader}
            setShowLoader={this.setShowLoader}
          />
        </>
      );
    }
  };
}

export default withLoader;
