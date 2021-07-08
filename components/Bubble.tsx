import React from 'react';
import Image from 'next/image';
import { motion, Variant } from 'framer-motion';

export interface Thumbnail {
  id: string;
  sizes: string;
  sourceUrl: string;
  mediaDetails: {
    height: number;
    width: number;
  };
}

interface BubbleProps {
  thumbnail: Thumbnail;
  handler(): void;
  subtitle: string;
  title: string;
  className?: string;
  imageWrapperClassName?: string;
  titleClassName?: string;
  subTitleClassName?: string;
  variants?: {
    initial?: Variant;
    exit?: Variant;
    enter?: Variant;
  }
}

const Bubble: React.FunctionComponent<BubbleProps> = ({
  thumbnail,
  handler,
  subtitle,
  title,
  className = '',
  imageWrapperClassName = '',
  titleClassName = '',
  subTitleClassName = '',
  variants = {},
}: BubbleProps) => {
  const clickHandler = (): void => {
    handler();
    if (window.innerWidth < 1024) {
      window.scrollTo({ left: 0, top: 0 });
    }
  };

  const articleVariants = {
    initial: { y: -20, opacity: 0 },
    exit: { y: -20, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    ...variants,
  };

  return (
    <motion.article
      variants={articleVariants}
      className={`px-4 pb-8 md:pb-12 flex flex-col justify-center group w-1/2 z-20 ${className}`}>
      <button type="button" onClick={clickHandler}>
        <div
          className={`overflow-hidden border-box relative rounded-full w-screen-2/5 h-screen-w-2/5 md:w-40 md:h-40  bg-black mb-3 mx-auto border-red group-hover:border-4 transition-all ${imageWrapperClassName}`}>
          <Image
            src={thumbnail.sourceUrl}
            layout="fill"
            objectFit="cover"
            alt=""
          />
        </div>
        <h6
          className={`text-xs text-red uppercase leading-none group-hover:opacity-80 mb-2 ${subTitleClassName}`}>
          {subtitle}
        </h6>
        <h1
          className={`text-base leading-none transition-all duration-200 mx-auto mx-au text-black font-black group-hover:opacity-80 ${titleClassName}`}>
          {title}
        </h1>
      </button>
    </motion.article>
  );
};

export default Bubble;
