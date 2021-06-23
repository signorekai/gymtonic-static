import React from 'react';
import { Header, Footer } from 'components';
import { useGeneralSettings } from '@wpengine/headless/react';

export default function Layout(props: any): JSX.Element {
  const settings = useGeneralSettings();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { children } = props;

  return (
    <>
      <Header title={settings?.title} description={settings?.description} />
      {children}
      <Footer copyrightHolder={settings?.title} />
    </>
  );
};