import React from 'react';
import Image from 'next/image';
import { StoryNode } from 'wp-templates/page-stories';
import { useRouter } from 'next/router';

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
  isExpanded?: boolean;
  isHighlighted?: boolean;
  story: StoryNode;
  uri: string;
  handler(story: StoryNode): any;
}

const Bubble: React.FunctionComponent<BubbleProps> = ({
  className = '',
  isHighlighted = false,
  uri,
  story,
  isExpanded = false,
  handler,
}: BubbleProps) => {
  const router = useRouter();
  const clickHandler = (): void => {
    handler(story);
    if (window.innerWidth < 1024) {
      window.scrollTo({ left: 0, top: 0 });
    }
  };

  const { title } = story;
  const { thumbnail } = story?.thumbnail;
  const { videoTitle, youtubeVideo } = story?.storyFields;

  return (
    <article
      className={`px-4 pb-8 md:pb-12 flex flex-col justify-center group w-1/2 ${
        isExpanded ? 'md:w-1/3 lg:w-full' : 'md:w-1/3 lg:w-1/2 xl:w-1/3'
      } z-20`}>
      <a
        role="button"
        tabIndex={-1}
        onClick={clickHandler}
        onKeyDown={clickHandler}>
        <div
          className={`${className} overflow-hidden border-box relative rounded-full w-screen-2/5 h-screen-w-2/5 md:w-40 md:h-40  bg-black mb-3 mx-auto ${
            isHighlighted ? 'border-4' : 'border-0'
          } border-red group-hover:border-4 transition-all`}>
          <Image src={thumbnail.sourceUrl} layout="fill" alt="" />
        </div>
        <h6 className="text-xs text-red uppercase leading-none group-hover:opacity-80 mb-2">
          {title}
        </h6>
        <h1
          className={`text-base leading-none transition-all duration-200 ${
            isExpanded ? 'md:max-w-1/2' : ''
          } mx-auto mx-au text-black font-black group-hover:opacity-80`}>
          {videoTitle}
        </h1>
      </a>
    </article>
  );
};

export default Bubble;
