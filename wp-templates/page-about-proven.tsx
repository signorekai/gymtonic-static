import React, { useContext, useEffect } from 'react';
import withLayout, { WithLayoutProps } from 'components/Layout';
import Image from 'next/image';

import ArmOnRed from 'assets/images/arm-on-red.png';
import { LoaderContext, LoaderContextType } from 'pages/_app';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AboutCard from 'components/AboutCard';
import MobileAboutCard from 'components/MobileAboutCard';

const About: React.FunctionComponent<WithLayoutProps> = ({
  setScrolledHeader,
}: WithLayoutProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { setShowLoader }: LoaderContextType = useContext(LoaderContext);

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.main className="flex flex-col lg:flex-row relative items-start">
      <AboutCard hideOnMobile />
      <MobileAboutCard />
      <motion.section
        layoutId="about"
        className="order-2 lg:order-1 w-full lg:w-1/2 bg-red text-white min-h-screen relative lg:sticky top-0 px-4 md:px-16 pt-10 md:pt-18 lg:pt-22">
        <div className="w-1/3 h-auto absolute right-0 top-0 lg:top-5 z-0">
          <Image
            src={ArmOnRed}
            sizes="(min-width: 768px) 260px, 140px"
            quality={100}
            alt=""
          />
        </div>
        <h2 className="text-2xl md:text-5xl leading-tight md:leading-none font-black relative z-10">
          As you get older, <br />
          you <em>can</em> get stronger
        </h2>
        <h4 className="text-lg md:text-2xl leading-tight mt-5 font-black">
          Why bother? So you can continue to do the things you love – whether it
          is working, hobbies, cooking, sports, taking care of your grandkids –
          or simply living your life without relying on others.
        </h4>
      </motion.section>
    </motion.main>
  );
};

export default withLayout(About);
