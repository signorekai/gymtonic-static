import React from 'react';
import { Header, Footer } from 'components';
import { useGeneralSettings } from '@wpengine/headless/react';

export default function Layout(props: any): JSX.Element {
  const settings = useGeneralSettings();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { children }: { children: JSX.Element } = props;

  return (
    <>
      <Header title={settings?.title} description={settings?.description} />
      <div className="font-sans">{children}</div>
      <Footer copyrightHolder={settings?.title} />
    </>
  );
}
