import AboutCard from 'components/AboutCard';
import withLayout, { WithLayoutProps } from 'components/Layout';
import MobileAboutHeader from 'components/MobileAboutHeader';
import { LoaderContext, LoaderContextType } from 'pages/_app';
import React, { useEffect, useContext } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import ScreenOnRed from 'assets/images/screen-on-red.png';
import withMobileNav from 'components/MobileNav';
import withLoader from 'components/Loader';

const Page: React.FunctionComponent<any> = ({
  setScrolledHeader,
  setShowLoader,
}: WithLayoutProps) => {
  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col lg:flex-row relative items-start min-h-screen">
      <AboutCard hideOnMobile />
      <MobileAboutHeader isSticky={false} />
      <section className="lg:flex lg:min-h-screen flex-col justify-center order-2 lg:order-1 w-full lg:w-1/2 bg-red text-white flex-1 relative z-20 lg:sticky top-0 px-4 md:px-16 pt-10 md:pt-18 lg:pt-0">
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-5xl leading-none text-center font-black mt-10 lg:mt-0 mb-32">
          It won’t be difficult, just trust us :)
        </motion.h1>
        <div className="w-2/3 md:w-1/2 absolute bottom-0 left-0">
          <Image
            src={ScreenOnRed}
            sizes="(min-width: 768px) 360px, 240px"
            quality={100}
            alt=""
          />
        </div>
      </section>
    </main>
  );
};

export default withLoader(withMobileNav(withLayout(Page)));
