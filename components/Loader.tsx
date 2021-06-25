import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Image from 'next/image';

import { LoaderContext, LoaderContextType } from 'pages/_app';
import loading from '../assets/images/loading2.gif';

const transition = { duration: 0.5, ease: [0.175, 0.85, 0.42, 0.96] };

export default function Loader(): JSX.Element {
  const router = useRouter();
  const animControls = useAnimation();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let { showLoader, setShowLoader }: LoaderContextType =
    useContext(LoaderContext);

  useEffect(() => {
    console.log('showLoader change', showLoader);
    void animControls.stop();
    void animControls.start({
      opacity: showLoader ? 1 : 0,
      transition,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLoader]);

  const handleStart = (url: string) => {
    console.log('start routechange');
    void animControls.start({
      opacity: 1,
      transition,
    });
  };

  const handleComplete = (url: string) => {
    console.log('complete routechange');
    void animControls.start({
      opacity: 0,
      transition,
    });
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
    <AnimatePresence>
      <motion.div
        animate={animControls}
        className="fixed z-50 top-0 left-0 w-full h-full pointer-events-none bg-pink flex flex-col justify-center items-center"
        initial={{ opacity: showLoader ? 0 : 1 }}>
        <Image src={loading} alt="" width={126} height={222} />
      </motion.div>
    </AnimatePresence>
  );
}
