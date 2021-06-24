import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

interface Props {
  totalFrames: number;
  ext?: string;
  path: string;
}

export default function VideoScroller({
  ext = 'jpg',
  totalFrames,
  path,
}: Props): JSX.Element {
  const scrollerRef = useRef(null);
  const canvasRef = useRef(null);
  const [frame, setFrame] = useState(0);

  const frames: Array<string> = useMemo(() => {
    const iFrames = [];
    // eslint-disable-next-line no-plusplus
    for (let x = 0; x <= totalFrames; x++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      iFrames.push(`${path}/frame-${x}.${ext}`);
    }
    return iFrames;
  }, [ext, path, totalFrames]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollerRef.current) {
        const maxAmount =
          scrollerRef.current?.scrollHeight -
          document.documentElement.clientHeight * 1.1;
        const currentAmount =
          window.pageYOffset - scrollerRef.current?.offsetTop;

        const scrollPercentage = currentAmount / maxAmount;
        setFrame(
          currentAmount < maxAmount
            ? Math.round(scrollPercentage * totalFrames)
            : totalFrames,
        );
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ext, path, totalFrames]);

  return (
    <section className="h-[200vh]" ref={scrollerRef}>
      <div className="sticky top-0 l-0 w-full h-screen flex flex-col justify-center items-center border-60 border-red">
        {frames.map((url, index) => (
          <Image
            src={url}
            alt=""
            layout="fill"
            priority
            className={index === frame ? 'absolute z-30' : 'relative'}
          />
        ))}
      </div>
    </section>
  );
}
