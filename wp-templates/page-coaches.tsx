import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getApolloClient } from '@wpengine/headless';

import withLayout, { WithLayoutProps } from 'components/Layout';
import AboutCard from 'components/AboutCard';
import MobileAboutHeader from 'components/MobileAboutHeader';
import { GetStaticPropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { LoaderContext, LoaderContextType } from 'pages/_app';
import { getNextStaticProps } from '@wpengine/headless/next';

import ArmOnRed from 'assets/images/arm-on-red.png';
import DownloadBtn from 'assets/images/download.png';
import Carousel, { CarouselCard } from 'components/Carousel';

interface ResearchPaperFields {
  typeOfLink: 'external_link' | 'pdf';
  researchOrganisation: string;
  url: string;
  file: {
    mediaItemUrl: string;
  };
}

export interface ResearchPaperNode {
  id: string;
  title: string;
  researchPaper: ResearchPaperFields;
}

interface ResearchPaperData {
  researchPapers: {
    edges: {
      node: ResearchPaperNode;
    }[];
  };
}

interface ResearchPaperCardProps {
  title: string;
  organisation: string;
  file: string | null;
  url: string;
  type: 'external_link' | 'pdf';
  index: number;
}

const ResearchPaperCard: React.FunctionComponent<ResearchPaperCardProps> = ({
  title,
  organisation,
  file,
  type,
  url,
  index,
}: ResearchPaperCardProps) => {
  const link = type === 'external_link' ? url : file || '';
  return (
    <motion.article
      custom={{ index }}
      variants={{
        exit: { x: -20, opacity: 0 },
        enter: (custom: { index: number }) => ({
          x: 0,
          opacity: 1,
          transition: { delay: custom.index * 0.08 + 0.3 },
        }),
      }}
      initial="exit"
      animate="enter"
      className="w-full md:w-1/3 mb-3 group">
      <Link href={link}>
        <a target="_blank">
          <h2 className="group-hover:opacity-90 transition-opacity font-bold uppercase text-xxs md:text-xs mt-3 md:max-w-5/6">
            {organisation}
          </h2>
          <h1 className="group-hover:opacity-90 transition-opacity font-black text-sm mt-1 md:text-base md:max-w-5/6">
            {title}
          </h1>
          <div className="w-7 h-7 relative mt-3 duration-200 transition-transform group-hover:-translate-y-1">
            <Image src={DownloadBtn} alt="" layout="fill" />
          </div>
        </a>
      </Link>
    </motion.article>
  );
};

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

  const h4Classes = 'text-lg md:text-2xl mt-5';

  return (
    <main className="flex flex-col lg:flex-row items-start relative">
      <AboutCard hideOnMobile />
      <MobileAboutHeader />
      <section className="order-2 lg:order-1 w-full lg:w-1/2 bg-red text-white lg:min-h-screen relative z-20 lg:sticky top-0 pt-10 md:pt-18 lg:pt-22">
        <div className="px-4 md:px-16 ">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-5xl leading-tight md:leading-none font-black relative z-10">
            Coaches
          </motion.h2>
          <motion.h4
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
            className={h4Classes}>
            They’re exercise trainers, physiotherapists and occupational
            therapists and fitness instructors trained overseas.
          </motion.h4>
          <motion.h4
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
            className={h4Classes}>
            While they are professionals, the uncles and aunties at our gyms
            treat them like their own children: Their training sessions are
            filled with encouragement and laughter.
          </motion.h4>
        </div>
        <motion.h5
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          className="font-bold uppercase text-xs mt-8 text-center">
          What they say
        </motion.h5>
        <Carousel>
          <CarouselCard>test</CarouselCard>
          <CarouselCard>test</CarouselCard>
        </Carousel>
      </section>
    </main>
  );
};

export default withLayout(About);
