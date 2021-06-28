/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { AnimationControls } from 'framer-motion/types/animation/types';

import loading from '../assets/images/loading2.gif';

const transition = { duration: 0.35, ease: [0.175, 0.85, 0.42, 0.96] };
// export const LoaderContext = createContext<any>(null);

interface Props {
  showLoader: boolean;
}

export default function Loader({ showLoader = true }: Props): JSX.Element {
  const router = useRouter();
  const animControls = useAnimation();
  const refShowLoader = useRef(false);
  const [showLoaderState, setShowLoaderState] = useState(refShowLoader.current);

  useEffect(() => {
    async function changeLoaderState() {
      if (showLoader !== refShowLoader.current) {
        console.log('Show <motion.div>, initial opacity:', {
          opacity: refShowLoader.current ? 1 : 0,
        });
        setShowLoaderState(showLoader);
        refShowLoader.current = showLoader;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`animating loader to ${showLoader ? 1 : 0}`);
        await animControls.start({
          opacity: showLoader ? 1 : 0,
          transition,
        });
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`animated loader to ${showLoader === true}`);
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
        className="fixed z-50 top-0 left-0 w-full h-full pointer-events-none bg-pink flex flex-col justify-center items-center">
        <Image src={loading} alt="" width={126} height={222} />
      </motion.div>
    </AnimatePresence>
  );
}
