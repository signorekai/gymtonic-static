import AboutCard from 'components/AboutCard';
import withLayout, { WithLayoutProps } from 'components/Layout';
import MobileAboutHeader from 'components/MobileAboutHeader';
import { LoaderContext, LoaderContextType } from 'pages/_app';
import React, { useEffect, useContext } from 'react';

const Simple: React.FunctionComponent<WithLayoutProps> = ({ setScrolledHeader }: WithLayoutProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { setShowLoader }: LoaderContextType = useContext(LoaderContext);
  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col lg:flex-row relative items-start min-h-screen">
      <AboutCard hideOnMobile />
      <MobileAboutHeader isSticky={false} />
      <section className="lg:flex lg:min-h-screen flex-col justify-center order-2 lg:order-1 w-full lg:w-1/2 bg-red text-white flex-1 relative z-20 lg:sticky top-0 px-4 md:px-16 pt-10 md:pt-18 lg:pt-0">
        <h1 className="text-3xl md:text-5xl leading-none text-center font-black mt-10">
          It won’t be difficult, just trust us :)
        </h1>
      </section>
    </main>
  );
};

export default withLayout(Simple);