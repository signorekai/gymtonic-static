import { RefObject, useEffect, useRef } from 'react';

export function useScroll(
  ref: RefObject<HTMLDivElement>,
  opts?: {
    canGoBeyondBoundary: boolean;
  },
): {
  scrollX: number;
  scrollY: number;
  deltaX: number;
  deltaY: number;
  scrollXProgress: number;
  scrollYProgress: number;
} {
  const previousValues = useRef({
    scrollX: 0,
    scrollY: 0,
  });

  const values = useRef({
    scrollX: 0,
    scrollY: 0,
    deltaX: 0,
    deltaY: 0,
    scrollXProgress: 0,
    scrollYProgress: 0,
  });

  const defaultOptions = {
    canGoBeyondBoundary: false,
  };

  const options = { ...defaultOptions, ...opts };

  useEffect(() => {
    const element = ref.current;
    function handleScroll() {
      if (element) {
        values.current.scrollX = window.pageXOffset - element?.offsetLeft;
        values.current.scrollY = window.pageYOffset - element?.offsetTop;

        values.current.deltaX =
          values.current.scrollX - previousValues.current.scrollX;

        values.current.deltaY =
          values.current.scrollY - previousValues.current.scrollY;

        previousValues.current.scrollX = values.current.scrollX;
        previousValues.current.scrollY = values.current.scrollY;

        if (options.canGoBeyondBoundary === false) {
          if (values.current.scrollX < 0) values.current.scrollX = 0;
          if (values.current.scrollY < 0) values.current.scrollY = 0;
        }

        values.current.scrollXProgress =
          values.current.scrollX / (element.scrollWidth - window.innerWidth) ||
          0;
        values.current.scrollYProgress =
          values.current.scrollY /
            (element.scrollHeight - window.innerHeight) || 0;

        if (options.canGoBeyondBoundary === false) {
          values.current.scrollXProgress = Math.max(
            0,
            values.current.scrollXProgress,
          );

          values.current.scrollXProgress = Math.min(
            1,
            values.current.scrollXProgress,
          );

          values.current.scrollYProgress = Math.max(
            0,
            values.current.scrollYProgress,
          );
          values.current.scrollYProgress = Math.min(
            1,
            values.current.scrollYProgress,
          );
        }
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
