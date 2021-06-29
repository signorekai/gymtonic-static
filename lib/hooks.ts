import { RefObject, useContext, useEffect, useRef, useState } from 'react';

export function useScroll(
  ref: RefObject<HTMLDivElement>,
  opts?: {
    canGoNegative: boolean;
  },
): {
  scrollX: number;
  scrollY: number;
  scrollXProgress: number;
  scrollYProgress: number;
} {
  const values = useRef({
    scrollX: 0,
    scrollY: 0,
    scrollXProgress: 0,
    scrollYProgress: 0,
  });

  const defaultOptions = {
    canGoNegative: false,
  };

  const options = { ...defaultOptions, ...opts };

  useEffect(() => {
    const element = ref.current;
    function handleScroll() {
      if (element) {
        values.current.scrollX = window.pageXOffset - element?.offsetLeft;
        values.current.scrollY = window.pageYOffset - element?.offsetTop;

        if (options.canGoNegative === false) {
          if (values.current.scrollX < 0) values.current.scrollX = 0;
          if (values.current.scrollY < 0) values.current.scrollY = 0;
        }

        values.current.scrollXProgress =
          values.current.scrollX / (element.scrollWidth - window.innerWidth);
        values.current.scrollYProgress =
          values.current.scrollY / (element.scrollHeight - window.innerHeight);
      }
    }
    if (element) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return values.current;
}
