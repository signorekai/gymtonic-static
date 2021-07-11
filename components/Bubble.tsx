import React from 'react';
import Image from 'next/image';
import { motion, Variant } from 'framer-motion';

interface BubbleProps {
  thumbnail?: string;
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
  };
}

const Bubble: React.FunctionComponent<BubbleProps> = ({
  thumbnail,
  handler,
  subtitle,
  title,
  className = '',
  imageWrapperClassName = '',
  titleClassName = 'text-base',
  subTitleClassName = 'text-xs',
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
      className={`px-4 pb-8 md:pb-12 flex flex-col justify-center group z-20 ${className}`}>
      <button type="button" onClick={clickHandler}>
        {thumbnail && (
          <div
            className={`overflow-hidden border-box relative rounded-full w-screen-2/5 h-screen-w-2/5 md:w-40 md:h-40  bg-black mb-3 mx-auto border-red group-hover:border-4 transition-all ${imageWrapperClassName}`}>
            <Image
              src={thumbnail}
              layout="fill"
              sizes="320px"
              quality={90}
              placeholder="blur"
              blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOUkpA4CAABqwENo/rLPQAAAABJRU5ErkJggg=="
              objectFit="cover"
              alt={title}
            />
          </div>
        )}
        <h6
          className={`text-red uppercase leading-none group-hover:opacity-80 mb-2 ${subTitleClassName}`}>
          {subtitle}
        </h6>
        <h1
          className={`leading-none transition-all duration-200 mx-auto mx-au text-black font-black group-hover:opacity-80 ${titleClassName}`}>
          {title}
        </h1>
      </button>
    </motion.article>
  );
};

export default Bubble;
