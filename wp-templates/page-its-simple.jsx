import AboutCard from '../components/AboutCard';
import withLayout from '../components/Layout';
import MobileAboutHeader from '../components/MobileAboutHeader';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import ScreenOnRed from '../assets/images/screen-on-red.png';
import withMobileNav from '../components/MobileNav';
import withLoader from '../components/Loader';
import withSignUpForm from '../components/SignUpForm';

import SignUpBtn from '../components/SignUpButton';
import SignupBtnSrc from '../assets/images/SignUpButtons-4-1.png';
import SignupBtnHoverSrc from '../assets/images/SignUpButtons-4-2.png';
import SignupBtnMobileSrc from '../assets/images/SignUpButtons-Small-4.png';
import { useActiveHeader } from '../lib/hooks';

const Page = ({
  setScrolledHeader,
  setShowLoader,
  setShowSignUpForm,
  setShowHeader,
}) => {
  useActiveHeader(setShowHeader);

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col lg:flex-row relative items-start min-h-screen page-about">
      <AboutCard hideOnMobile />
      <MobileAboutHeader isSticky={false} />
      <section className="content-container content-container-px justify-center flex-1 pt-10 md:pt-18 lg:pt-0">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
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
      <div className="fixed bottom-5 right-5 z-40">
        <SignUpBtn
          setShowSignUpForm={setShowSignUpForm}
          src={SignupBtnSrc}
          mobileSrc={SignupBtnMobileSrc}
          hoverSrc={SignupBtnHoverSrc}
        />
      </div>
    </main>
  );
};

export default withSignUpForm(withLoader(withMobileNav(withLayout(Page))));
