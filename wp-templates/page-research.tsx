import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gql, useQuery } from '@apollo/client';
import { getApolloClient } from '@wpengine/headless';

import AboutCard from 'components/AboutCard';
import MobileAboutHeader from 'components/MobileAboutHeader';
import { GetStaticPropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { getNextStaticProps } from '@wpengine/headless/next';

import withLayout from 'components/Layout';
import withSignUpForm from 'components/SignUpForm';
import withMobileNav from 'components/MobileNav';
import withLoader from 'components/Loader';

import SignUpBtn from 'components/SignUpButton';
import SignupBtnSrc from 'assets/images/SignUpButtons-3-1.png';
import SignupBtnHoverSrc from 'assets/images/SignUpButtons-3-2.png';
import SignupBtnMobileSrc from 'assets/images/SignUpButtons-Small-3.png';
import ArmOnRed from 'assets/images/arm-on-red.png';

const query = gql`
  {
    researchPapers(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      edges {
        node {
          id
          title
          moreResearchInfo {
            researchOrganisation
            typeOfLink
            url
            file {
              mediaItemUrl
            }
          }
        }
      }
    }
  }
`;

interface ResearchPaperFields {
  typeOfLink: 'external_link' | 'pdf';
  researchOrganisation: string;
  url: string;
  file: {
    mediaItemUrl: string;
  };
}

interface ResearchPaperNode {
  id: string;
  title: string;
  moreResearchInfo: ResearchPaperFields;
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
          <h1 className="group-hover:opacity-90 mt-1 transition-opacity font-black text-sm mt-1 md:text-base leading-none md:max-w-5/6">
            {title}
          </h1>
          <div className="w-7 h-7 relative mt-2 duration-200 transition-transform group-hover:-translate-y-1 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              className="w-full"
              viewBox="0 0 28 28">
              <g transform="translate(-2601 1674)">
                <g transform="translate(5858 -5932) rotate(90)">
                  <g
                    className="stroke-current"
                    transform="translate(4258 3229)"
                    fill="none"
                    strokeWidth="1.5">
                    <circle cx="14" cy="14" r="14" stroke="none" />
                    <circle cx="14" cy="14" r="13.25" fill="none" />
                  </g>
                </g>
                <path
                  d="M4315.6,3241.3l6.374,5.975-6.355,6.018"
                  transform="translate(5862.298 -5975.927) rotate(90)"
                  className="stroke-current"
                  fill="none"
                  strokeWidth="1.5"
                />
                <line
                  y2="11.719"
                  transform="translate(2615.004 -1666.047)"
                  fill="none"
                  className="stroke-current"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          </div>
        </a>
      </Link>
    </motion.article>
  );
};

const Page: React.FunctionComponent<any> = ({
  setScrolledHeader,
  setShowLoader,
  setShowSignUpForm,
}: WithLayoutProps & WithSignUpFormProps) => {
  const { data }: { data: ResearchPaperData | undefined } = useQuery(query);
  const researchPapers = data?.researchPapers.edges;

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col lg:flex-row items-start relative">
      <AboutCard hideOnMobile />
      <MobileAboutHeader isSticky />
      <section className="content-container content-container-px pt-10 md:pt-18 lg:pt-22">
        <div className="w-1/3 h-auto absolute right-0 top-0 lg:top-5 z-0">
          <Image
            src={ArmOnRed}
            sizes="(min-width: 768px) 260px, 140px"
            quality={100}
            alt=""
          />
        </div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-5xl leading-tight md:leading-none font-black relative z-10">
          As you get older, <br />
          you <em>can</em> get stronger
        </motion.h2>
        <motion.h4
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
          className="text-lg md:text-2xl leading-none mt:leading-base mt-5 pb-8 border-b-2 border-white">
          Why bother? So you can continue to do the things you love – whether it
          is working, hobbies, cooking, sports, taking care of your grandkids –
          or simply living your life without relying on others.
        </motion.h4>
        <motion.h5
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          className="font-bold uppercase text-xs mt-3">
          Research Papers
        </motion.h5>
        <section className="flex flex-wrap flex-row mb-6">
          {researchPapers?.map(({ node: researchPaper }, index: number) => (
            <ResearchPaperCard
              index={index}
              key={researchPaper.id}
              title={researchPaper.title}
              type={researchPaper.moreResearchInfo.typeOfLink}
              organisation={researchPaper.moreResearchInfo.researchOrganisation}
              file={
                researchPaper.moreResearchInfo.file
                  ? researchPaper.moreResearchInfo.file.mediaItemUrl
                  : null
              }
              url={researchPaper.moreResearchInfo.url}
            />
          ))}
        </section>
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps(context: GetStaticPropsContext) {
  const client = getApolloClient(context);
  await client.query({ query });
  return getNextStaticProps(context);
}
