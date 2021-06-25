import React, { useState, MutableRefObject } from 'react';
import { Header, Footer } from 'components';
import { useGeneralSettings } from '@wpengine/headless/react';

interface Props {
  children: Array<JSX.Element>;
}

export default function Layout({ children }: Props): JSX.Element {
  const settings = useGeneralSettings();

  const [headerRef, setHeaderRef] =
    useState<MutableRefObject<HTMLElement> | null>(null);

  const childrenWithExtraProp = React.Children.map(children, (child) =>
    React.cloneElement(child, { setHeaderRef }),
  );

  return (
    <>
      <Header headerRef={headerRef} />
      <div className="font-sans antialiased">{childrenWithExtraProp}</div>
      <Footer copyrightHolder={settings?.title} />
    </>
  );
}
