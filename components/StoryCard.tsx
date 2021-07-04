import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import { Gym } from 'wp-templates/page-stories';
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
      y: '-40',
    },
    enter: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: '-40',
    },
  };

  return (
    <article
      className={`w-full ${
        isExpanded ? 'lg:w-7/10 transition-all duration-200' : 'lg:w-1/2'
      } order-1 lg:order-2 bg-red text-white lg:h-screen lg:sticky top-0 pt-34 lg:pt-24 px-4 md:px-14 z-20`}>
      <Head>
        <title>{title} - GymTonic</title>
      </Head>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={key}
          variants={parentVariants}
          initial="beforeEnter"
          animate="enter"
          exit="exit">
          <h1 className="font-bold uppercase text-xs">{title}</h1>
          <div className="flex flex-col md:flex-row md:justify-between">
            <h2 className="font-bold text-lg md:text-2xl mt-1 md:mt-0 leading-none">
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
          <p className="text-sm md:text-lg leading-tighter md:leading-tighter mb-10">
            {description}
          </p>
        </motion.div>
      </AnimatePresence>
    </article>
  );
};

export default StoryCard;
