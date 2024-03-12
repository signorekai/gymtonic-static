/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Header from './Header';
import Head from 'next/head';
import Modal from './Modal';

export default function withLayout(Component, options) {
  // compiling opts
  const opts = {
    mobileNavBtnInHeader: true,
    ...options,
  };
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.setHeaderRef = this.setHeaderRef.bind(this);
      this.setScrolledHeader = this.setScrolledHeader.bind(this);
      this.setMobileNavBtnStyle = this.setMobileNavBtnStyle.bind(this);
      this.setShowHeader = this.setShowHeader.bind(this);
      this.appRef = React.createRef();

      this.state = {
        headerRef: null,
        showLoader: true,
        scrolledHeader: false,
        mobileNavBtnStyle: 'text-red',
        noAnimation: false,
        showHeader: true,
      };
    }

    componentDidMount() {
      function handleResize() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    setShowHeader(arg0) {
      const { showHeader } = this.state;
      if (showHeader !== arg0) this.setState({ showHeader: arg0 });
    }

    setScrolledHeader(scrolledHeader, noAnimation = false) {
      this.setState({ scrolledHeader, noAnimation });
    }

    setMobileNavBtnStyle(mobileNavBtnStyle) {
      this.setState({ mobileNavBtnStyle });
    }

    setHeaderRef(headerRef) {
      this.setState({ headerRef });
    }

    // const [headerRef, setHeaderRef] =
    //   useState<RefObject<HTMLElement> | null>(null);
    render() {
      const {
        headerRef,
        showLoader,
        showHeader,
        scrolledHeader,
        noAnimation,
        mobileNavBtnStyle,
      } = this.state;
      const { setShowLoader, setShowMobileNav } = this.props;

      return (
        <div
          id="appRef"
          ref={this.appRef}
          className="font-sans antialiased border-box">
          <Head>
            <link
              rel="apple-touch-icon-precomposed"
              sizes="57x57"
              href="apple-touch-icon-57x57.png"
            />
            <link
              rel="apple-touch-icon-precomposed"
              sizes="114x114"
              href="apple-touch-icon-114x114.png"
            />
            <link
              rel="apple-touch-icon-precomposed"
              sizes="72x72"
              href="apple-touch-icon-72x72.png"
            />
            <link
              rel="apple-touch-icon-precomposed"
              sizes="144x144"
              href="apple-touch-icon-144x144.png"
            />
            <link
              rel="apple-touch-icon-precomposed"
              sizes="60x60"
              href="apple-touch-icon-60x60.png"
            />
            <link
              rel="apple-touch-icon-precomposed"
              sizes="120x120"
              href="apple-touch-icon-120x120.png"
            />
            <link
              rel="apple-touch-icon-precomposed"
              sizes="76x76"
              href="apple-touch-icon-76x76.png"
            />
            <link
              rel="apple-touch-icon-precomposed"
              sizes="152x152"
              href="apple-touch-icon-152x152.png"
            />
            <link
              rel="icon"
              type="image/png"
              href="favicon-196x196.png"
              sizes="196x196"
            />
            <link
              rel="icon"
              type="image/png"
              href="favicon-96x96.png"
              sizes="96x96"
            />
            <link
              rel="icon"
              type="image/png"
              href="favicon-32x32.png"
              sizes="32x32"
            />
            <link
              rel="icon"
              type="image/png"
              href="favicon-16x16.png"
              sizes="16x16"
            />
            <link
              rel="icon"
              type="image/png"
              href="favicon-128.png"
              sizes="128x128"
            />
            <meta name="application-name" content="&nbsp;" />
            <meta name="msapplication-TileColor" content="#FFFFFF" />
            <meta name="msapplication-TileImage" content="mstile-144x144.png" />
            <meta
              name="msapplication-square70x70logo"
              content="mstile-70x70.png"
            />
            <meta
              name="msapplication-square150x150logo"
              content="mstile-150x150.png"
            />
            <meta
              name="msapplication-wide310x150logo"
              content="mstile-310x150.png"
            />
            <meta
              name="msapplication-square310x310logo"
              content="mstile-310x310.png"
            />

            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-4WF6C39R6J"
            />
            <script
              async
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', 'G-4WF6C39R6J');`,
              }}
            />
          </Head>
          <Header
            {...this.props}
            mobileNavBtnInHeader={opts.mobileNavBtnInHeader}
            mobileNavBtnstyle={mobileNavBtnStyle}
            noAnimation={noAnimation}
            setShowMobileNav={setShowMobileNav}
            headerRef={headerRef}
            scrolledHeader={scrolledHeader}
            showHeader={showHeader}
          />
          <Modal />
          <Component
            {...this.props}
            setMobileNavBtnStyle={this.setMobileNavBtnStyle}
            appRef={this.appRef}
            setScrolledHeader={this.setScrolledHeader}
            setHeaderRef={this.setHeaderRef}
            showLoader={showLoader}
            setShowLoader={setShowLoader}
            setShowHeader={this.setShowHeader}
          />
        </div>
      );
    }
  };
}
