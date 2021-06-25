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
  const [active, setActive] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { showLoader }: LoaderContextType = useContext(LoaderContext);

  useEffect(() => {
    setActive(showLoader);
  }, [showLoader]);

  const handleStart = (url: string) => {
    if (url !== router.asPath) {
      setActive(true);
    }
  };

  const handleComplete = (url: string) => {
    if (url !== '/') setActive(false);
  };

  useEffect(() => {
    void animControls.start({
      opacity: active ? 1 : 0,
      transition,
    });
  }, [animControls, active]);

  useEffect(() => {
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  return (
    <AnimatePresence>
      <motion.div
        animate={animControls}
        className="fixed z-50 top-0 left-0 w-full h-full pointer-events-none bg-pink flex flex-col justify-center items-center"
        initial={{ opacity: 1 }}>
        <Image src={loading} alt="" width={126} height={222} />
      </motion.div>
    </AnimatePresence>
  );
}
