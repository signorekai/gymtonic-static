import AboutCard from 'components/AboutCard';
import withLayout, { WithLayoutProps } from 'components/Layout';
import withLoader from 'components/Loader';
import MobileAboutHeader from 'components/MobileAboutHeader';
import withMobileNav from 'components/MobileNav';
import React, { useEffect } from 'react';

const Page: React.FunctionComponent<any> = ({
  setScrolledHeader,
  setShowLoader,
}: WithLayoutProps) => {
  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
  }, [setScrolledHeader, setShowLoader]);

  return (
    <main className="flex flex-col lg:flex-row relative items-start min-h-screen">
      <AboutCard hideOnMobile />
      <MobileAboutHeader />
      <section className="bg-red lg:flex lg:min-h-screen lg:sticky top-0 flex-col justify-center order-2 lg:order-1 w-full lg:w-1/2">
        Hi
      </section>
    </main>
  );
};

export default withLoader(withMobileNav(withLayout(Page)));
