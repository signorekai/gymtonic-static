import React, { useContext, useEffect } from 'react';
import withLayout, { WithLayoutProps } from 'components/Layout';

import { ThemeContext, ThemeContextType } from 'pages/_app';
import { motion } from 'framer-motion';
import AboutCard from 'components/AboutCard';

const About: React.FunctionComponent<WithLayoutProps> = ({
  setScrolledHeader,
}: WithLayoutProps) => {
  const { setShowLoader }: ThemeContextType =
    useContext<ThemeContextType>(ThemeContext);

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.main layout className="flex flex-col lg:flex-row relative">
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

export default withLayout(About);
