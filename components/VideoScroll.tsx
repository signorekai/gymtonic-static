import React, { useEffect, useRef, useState } from 'react';

export default function VideoScroller(): JSX.Element {
  const [scrollAmount, setScrollAmount] = useState(0);

  const scrollerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollerRef.current) {
        const maxAmount =
          scrollerRef.current?.scrollHeight -
          document.documentElement.clientHeight * 1.1;
        const currentAmount =
          window.pageYOffset - scrollerRef.current?.offsetTop;
        if (currentAmount < maxAmount) {
          setScrollAmount(
            Math.floor(currentAmount < maxAmount ? currentAmount : maxAmount)
          );
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    setScrollAmount(window.pageYOffset);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="h-[500vh]" ref={scrollerRef}>
      <div className="sticky top-0 l-0 w-full h-screen flex flex-col justify-center items-center border-60 border-red">
        {scrollAmount}
      </div>
    </section>
  );
}
