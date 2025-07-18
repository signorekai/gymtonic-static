/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

import loading from '../assets/images/loading.gif';

const transition = { duration: 0.35, ease: [0.175, 0.85, 0.42, 0.96] };

function Loader({ showLoader, setShowLoader }) {
  const router = useRouter();
  const animControls = useAnimation();
  const refShowLoader = useRef(false);

  const handleStart = (url) => {
    setShowLoader(true);
  };

  const handleComplete = (url) => {
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
        <Image src={loading} alt="" width={126} height={222} unoptimized={true} />
      </motion.div>
    </AnimatePresence>
  );
}

function withLoader(Component) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.setShowLoader = this.setShowLoader.bind(this);

      this.state = {
        showLoader: true,
      };
    }

    setShowLoader(showLoader) {
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
