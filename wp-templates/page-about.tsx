import React, { useEffect } from 'react';
import withLayout from 'components/Layout';

import { motion } from 'framer-motion';
import AboutCard from 'components/AboutCard';
import withMobileNav from 'components/MobileNav';
import withLoader from 'components/Loader';
import withSignUpForm from 'components/SignUpForm';

import SignUpBtn from 'components/SignUpButton';
import SignupBtnSrc from 'assets/images/SignUpButtons-2-1.png';
import SignupBtnHoverSrc from 'assets/images/SignUpButtons-2-2.png';
import SignupBtnMobileSrc from 'assets/images/SignUpButtons-Small-2.png';

const Page: React.FunctionComponent<any> = ({
  setScrolledHeader,
  setShowLoader,
  setMobileNavBtnStyle,
  setShowSignUpForm,
}: WithMobileNavProps & WithLayoutProps & WithSignUpFormProps) => {
  useEffect(() => {
    setMobileNavBtnStyle('text-red md:text-white');
    setShowLoader(false);
    setScrolledHeader(true, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.main
      layout
      className="flex flex-col lg:flex-row relative cursor-about">
      <AboutCard />
      <motion.section
        layoutId="about"
        className="order-1 lg:order-2 w-full lg:w-1/2 bg-red text-white lg:h-screen lg:sticky top-0">
        <div className="w-full h-screen-1/2 lg:h-screen border-red border-10 md:border-60">
          <video
            disablePictureInPicture
            controlsList="nodownload"
            playsInline
            autoPlay
            muted
            loop
            src="/videos/About.mp4"
            className="w-full h-full max-w-full relative z-20 object-cover">
            <source src="/videos/About.mp4" type="video/mp4" />
          </video>
        </div>
      </motion.section>
      <div className="fixed bottom-5 right-5 z-40">
        <SignUpBtn
          setShowSignUpForm={setShowSignUpForm}
          src={SignupBtnSrc}
          mobileSrc={SignupBtnMobileSrc}
          hoverSrc={SignupBtnHoverSrc}
        />
      </div>
    </motion.main>
  );
};

/* <div className="absolute top-0 right-0 w-1/3 h-auto">
<Image
  src={ArmOnRed}
  sizes="(min-width: 768px) 260px, 140px"
  quality={100}
  alt=""
/>
</div> */

export default withSignUpForm(withLoader(withMobileNav(withLayout(Page))));
