import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  className?: string;
  itemTitle: string;
  videoTitle: string;
  thumbnail: Thumbnail;
  isHighlighted?: boolean;
  uri: string;
}

const Bubble: React.FunctionComponent<BubbleProps> = ({
  className = '',
  isHighlighted = false,
  uri,
  thumbnail,
  videoTitle,
  itemTitle,
}: BubbleProps) => {
  return (
    <article className="m-4 md:m-8 flex flex-col justify-center group w-screen-2/5 md:w-40 last:self-start">
      <Link href={uri}>
        <a>
          <div
            className={`${className} overflow-hidden border-box relative rounded-full w-screen-2/5 h-screen-w-2/5 md:w-40 md:h-40  bg-black mb-3 mx-auto ${
              isHighlighted ? 'border-4' : 'border-0'
            } border-red group-hover:border-4 transition-all`}>
            <Image src={thumbnail.sourceUrl} layout="fill" alt="" />
          </div>
          <h6 className="text-xs text-red uppercase leading-none group-hover:opacity-80">{itemTitle}</h6>
          <h1 className="text-base text-black font-black group-hover:opacity-80">{videoTitle}</h1>
        </a>
      </Link>
    </article>
  );
};

export default Bubble;
