import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import GymLink from 'components/GymLink';

interface StoryProps {
  title: string;
  isExpanded?: boolean;
  videoTitle: string;
  youtubeVideo: string;
  description: string;
  key: string;
  gym: Gym;
}

const StoryCard: React.FunctionComponent<StoryProps> = ({
  title,
  isExpanded = false,
  videoTitle,
  youtubeVideo,
  description,
  key,
  gym,
}: StoryProps) => {
  const [youtubeID, setYoutubeId] = useState<string>('');

  useEffect(() => {
    const newID =
      youtubeVideo &&
      /youtu(?:.*\/v\/|.*v=|\.be\/)([A-Za-z0-9_-]{11})/.exec(youtubeVideo);

    if (newID && newID.length > 1) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      setYoutubeId(newID[1]);
    }
  }, [youtubeVideo]);

  const parentVariants = {
    beforeEnter: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <motion.article
      className={`w-full transition-all duration-200 ${
        isExpanded ? 'lg:w-7/10 lg:pt-24' : 'lg:w-1/2 lg:pt-30'
      } order-1 lg:order-2 lg:min-h-screen content-container-bg content-container-px content-container-positioning pt-36`}>
      <Head>
        <title>{title} - GymTonic</title>
      </Head>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={key}
          variants={parentVariants}
          initial="beforeEnter"
          animate="enter"
          exit="exit"
          className="lg:mx-1/20 wide:mx-auto max-w-5xl">
          <h1 className="font-bold uppercase text-xs">{title}</h1>
          <div className="flex flex-col md:flex-row md:justify-between">
            <h2 className="font-black text-lg md:text-2xl mt-1 md:mt-0 leading-none">
              {videoTitle}
            </h2>
            {gym && (
              <GymLink
                href={gym.uri}
                text={gym.title}
                linkStyle="white"
                type="inline"
              />
            )}
          </div>
          {youtubeVideo && (
            <div
              className="relative pt-0 h-0 my-3"
              style={{ paddingBottom: '56.25%' }}>
              <iframe
                title={videoTitle}
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeID}`}
                frameBorder="0"
              />
            </div>
          )}
          <p className="text-sm md:text-lg leading-tighter md:leading-tight mb-10">
            {description}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.article>
  );
};

export default StoryCard;
