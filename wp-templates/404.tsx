import React from 'react';
import { useGeneralSettings } from '@wpengine/headless/react';
import Header from 'components/Header';
import Footer from 'components/Footer';

export default function Page(): JSX.Element {
  const settings = useGeneralSettings();

  return (
    <>
      <main className="content content-page">
        <div className="wrap">
          <div>
            <div>
              <p>
                The page you were looking for does not exist or is no longer
                available.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer copyrightHolder={settings?.title} />
    </>
  );
}
