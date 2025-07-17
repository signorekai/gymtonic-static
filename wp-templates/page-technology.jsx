import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import AboutCard from '../components/AboutCard';
import Carousel, { CarouselCard } from '../components/Carousel';
import MobileAboutHeader from '../components/MobileAboutHeader';

import withLayout from '../components/Layout';
import withLoader from '../components/Loader';
import withSignUpForm from '../components/SignUpForm';
import withMobileNav from '../components/MobileNav';

import TechHeader1 from '../assets/images/tech-name-1.png';
import TechHeader2 from '../assets/images/tech-name-2.png';
import TechHeader3 from '../assets/images/tech-name-3.png';
import TechHeader4 from '../assets/images/tech-name-4.png';
import TechHeader5 from '../assets/images/tech-name-5.png';

import FREIEQ1 from '../assets/images/FREI-Equipment-1.png';
import FREIEQ2 from '../assets/images/FREI-Equipment-2.png';
import FREIEQ3 from '../assets/images/FREI-Equipment-3.png';
import FREIEQ4 from '../assets/images/FREI-Equipment-4.png';
import FREIEQ5 from '../assets/images/FREI-Equipment-5.png';

import HUREQ1 from '../assets/images/HUR-Equipment-1.png';
import HUREQ2 from '../assets/images/HUR-Equipment-2.png';
import HUREQ3a from '../assets/images/HUR-Equipment-3a.png';
import HUREQ3b from '../assets/images/HUR-Equipment-3b.png';
import HUREQ4 from '../assets/images/HUR-Equipment-4.png';
import HUREQ5 from '../assets/images/HUR-Equipment-5.png';

import HumanIllustration1 from '../assets/images/humanillust_1.png';
import HumanIllustration3 from '../assets/images/humanillust_3.png';
import HumanIllustration5 from '../assets/images/humanillust_5.png';
import HumanIllustration6 from '../assets/images/humanillust_6.png';
import HumanIllustration7 from '../assets/images/humanillust_7.png';

import CollapseBtn from '../assets/images/collapse.png';
import ExpandBtn from '../assets/images/expand.png';

import SignUpBtn from '../components/SignUpButton';
import SignupBtnSrc from '../assets/images/SignUpButtons-5-1.png';
import SignupBtnHoverSrc from '../assets/images/SignUpButtons-5-2.png';
import SignupBtnMobileSrc from '../assets/images/SignUpButtons-Small-5.png';

const TechCard = ({
  headerSrc,
  title,
  text,
  mainCardSrc,
  mainCardTitle,
  subCards,
  children,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`min-h-96 relative flex flex-col justify-center items-center pt-6 ${className}`}>
      <motion.div
        variants={{
          initial: { opacity: 0, y: -20 },
          enter: { opacity: 1, y: 0, transition: { delay: 0.1 } },
        }}
        className="w-2/3 md:w-1/3 mx-auto pointer-events-none">
        <Image unoptimized src={headerSrc} sizes="210px" alt={title} />
      </motion.div>
      <div className="flex flex-row w-full justify-center items-start md:items-center mt-2 px-2 mb-8 flex-wrap md:flex-nowrap">
        <div className="md:order-2 w-3/4 md:w-1/2 pointer-events-none">
          <Image
            sizes="(min-width: 768px) 370px, 200px"
            src={mainCardSrc}
            unoptimized
            priority
            quality={100}
          />
          <h2
            className="font-bold uppercase leading-none text-center text-xs mt-3"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: mainCardTitle }}
          />
        </div>
        <div
          className={`w-1/3 md:w-1/4 md:pr-4 mt-6 md:mt-0 md:order-1 pointer-events-none ${
            subCards[1] ? '' : 'hidden md:block'
          }`}>
          {subCards[1] ? (
            <>
              <Image
                sizes="(min-width: 768px) 200px, 100px"
                src={subCards[1].src}
                unoptimized
                quality={100}
              />
              <h2
                className="font-bold uppercase leading-none text-center text-xs mt-3"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: subCards[1].title }}
              />
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="w-1/3 md:w-1/4 md:pl-4 mt-6 md:mt-0 md:order-3 pointer-events-none">
          <Image
            sizes="(min-width: 768px) 200px, 100px"
            src={subCards[0].src}
            unoptimized
            quality={100}
          />
          <h2
            className="font-bold uppercase leading-none text-center text-xs mt-3"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: subCards[0].title }}
          />
        </div>
      </div>
      <p className="text-center text-sm leading-none md:text-lg md:leading-tight">
        {text}
      </p>
      <AnimatePresence exitBeforeEnter>
        {expanded && (
          <motion.div
            variants={{
              initial: {
                opacity: 0,
                y: 30,
                scale: 0,
                transformOrigin: 'bottom center',
              },
              enter: {
                opacity: 1,
                y: 0,
                scale: 1,
                transformOrigin: 'bottom center',
              },
              exit: {
                opacity: 0,
                y: 30,
                scale: 0,
                transformOrigin: 'bottom center',
              },
            }}
            className="w-2/3 md:w-1/3 lg:w-2/3 xl:w-1/3 max-w-[14rem] absolute bottom-12 rounded-md text-red bg-pink font-bold leading-none text-sm p-4 mt-3">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        variants={{
          hide: { opacity: 0, y: 30 },
          show: { opacity: 1, y: 0 },
        }}
        className="text-center mt-8">
        <button
          type="button"
          className="leading-0 focus:outline-none"
          onClick={() => {
            setExpanded(!expanded);
          }}>
          <AnimatePresence exitBeforeEnter>
            {expanded ? (
              <motion.div
                key="expanded"
                variants={{
                  initial: { rotate: 0, opacity: 0.2 },
                  animate: {
                    rotate: 0,
                    opacity: 1,
                    transition: { duration: 0.3 },
                  },
                  exit: {
                    rotate: 180,
                    opacity: 0.2,
                    transformOrigin: 'center',
                    transition: { duration: 0.4 },
                  },
                }}
                initial="initial"
                animate="animate"
                exit="exit">
                <Image unoptimized src={CollapseBtn} width={28} height={28} alt="" />
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                variants={{
                  initial: { rotate: 0, opacity: 0.2 },
                  animate: {
                    rotate: 0,
                    opacity: 1,
                    transition: { duration: 0.3 },
                  },
                  exit: {
                    rotate: 180,
                    opacity: 0.2,
                    transformOrigin: 'center',
                    transition: { duration: 0.4 },
                  },
                }}
                initial="initial"
                animate="animate"
                exit="exit">
                <Image unoptimized src={ExpandBtn} width={28} height={28} alt="" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </div>
  );
};

const Page = ({
  setScrolledHeader,
  setShowLoader,
  setShowSignUpForm,
  setShowHeader,
}) => {
  const scrollProgress = useRef(0);
  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
    const handleScroll = () => {
      if (scrollProgress.current < window.scrollY) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      scrollProgress.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setScrolledHeader, setShowLoader, setShowHeader]);

  return (
    <main className="flex flex-col lg:flex-row relative items-start min-h-screen page-about">
      <AboutCard hideOnMobile />
      <MobileAboutHeader isSticky />
      <section className="content-container pt-10 md:pt-18 lg:pt-32 flex-1">
        <div className="content-container-px">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-title text-center text-white lg:max-w-xs xl:max-w-lg mx-auto lg:mx-0 lg:text-left">
            Equipment that can help you
          </motion.h2>
        </div>
        <Carousel repeat={0} navBtnPosition="center" className="mb-6">
          <CarouselCard>
            <TechCard
              headerSrc={TechHeader1}
              title="Stand up for Singapore"
              text="These equipment help you stand up from a sitting position without pain."
              mainCardSrc={FREIEQ1}
              mainCardTitle="FREI<br />Leg Trainer"
              subCards={[
                {
                  src: HUREQ1,
                  title: 'HUR<BR />Leg Press Rehab',
                },
              ]}>
              <div className="text-center">
                <Image unoptimized src={HumanIllustration3} alt="" />
              </div>
              These machines work multiple muscle groups in the legs. The
              compound exercise primarily targets the quadriceps, hamstrings,
              glutes and calves by getting seniors to push resistance away with
              their legs. These machines help to build overall lower body
              strength which can translate to better walking and sit-to-stand
              capabilities.
            </TechCard>
          </CarouselCard>
          <CarouselCard>
            <TechCard
              headerSrc={TechHeader2}
              title="Go Jalan Jalan"
              text="These equipment help you walk faster and climb stairs with more confidence."
              mainCardSrc={FREIEQ2}
              mainCardTitle="FREI<br />Knee Flexor — Extensor"
              subCards={[
                {
                  src: HUREQ2,
                  title: 'HUR<BR />Leg Extension — Curl Rehab',
                },
              ]}>
              <div className="text-center">
                <Image unoptimized src={HumanIllustration1} alt="" />
              </div>
              These machines primarily strengthen the quadriceps and hamstrings
              via movements of leg extension and flexion. Doing so can reduce
              instability at the knee joints and help the legs function
              smoothly.
            </TechCard>
          </CarouselCard>
          <CarouselCard>
            <TechCard
              headerSrc={TechHeader3}
              title="Shop at NTUC"
              text="These equipment strengthen your upper body, so you can carry those heavy grocery bags home."
              mainCardSrc={FREIEQ3}
              mainCardTitle="FREI<br />Rowing Machine — Chest Press"
              subCards={[
                {
                  src: HUREQ3b,
                  title: 'HUR<BR />Lat Pull Easy Access',
                },
                {
                  src: HUREQ3a,
                  title: 'HUR<BR />Chest Press Easy Access',
                },
              ]}>
              <div className="text-center">
                <Image unoptimized src={HumanIllustration7} alt="" />
              </div>
              These machines work the upper body muscles via push and pull
              motions. The push motion primarily targets the pectoral muscles at
              the chest while the pull motion primarily targets the trapezius
              and latissimus dorsi at the back. The large angular grips offer
              different hand positions so every senior can find an optimum
              position.
            </TechCard>
          </CarouselCard>
          <CarouselCard>
            <TechCard
              headerSrc={TechHeader4}
              title="Reduce Backache"
              text="These equipment strengthen weak back muscles and improve your posture. You’ll look better!"
              mainCardSrc={FREIEQ4}
              mainCardTitle="FREI<br />Abdominal & Back Trainer"
              subCards={[
                {
                  src: HUREQ4,
                  title: 'HUR<BR />Abdomen — Back Easy Access',
                },
              ]}>
              <div className="text-center">
                <Image unoptimized src={HumanIllustration5} alt="" />
              </div>
              These machines strengthen the abdominal and back extensor muscles
              through crunch and back extension movements. Doing so can improve
              the support of spine, posture, and overall structural stability.
              The padded rollers offer good support and comfort during exercise.
            </TechCard>
          </CarouselCard>
          <CarouselCard>
            <TechCard
              headerSrc={TechHeader5}
              title="Balance on the MRT"
              text="These equipment strengthen the muscles on the sides of your legs that help you keep your balance."
              mainCardSrc={FREIEQ5}
              mainCardTitle="FREI<br />Abductor — Adductor"
              subCards={[
                {
                  src: HUREQ5,
                  title: 'HUR<BR />Adduction — Abduction Rehab',
                },
              ]}>
              <div className="text-center">
                <Image unoptimized src={HumanIllustration6} alt="" />
              </div>
              These machines primarily target the hip abductors and adductors.
              The hip abductors bring your legs away from the centre of the
              body, while the hip adductors do the opposite. Strengthening these
              opposing muscles stabilises the hip and contributes to overall
              stability and balance. It can also help prevent pain in the hip
              and knees.
            </TechCard>
          </CarouselCard>
        </Carousel>
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
