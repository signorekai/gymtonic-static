/* eslint-disable react/jsx-props-no-spreading */
import React, { MutableRefObject, RefObject } from 'react';
import { Header } from 'components';

interface LayoutState {
  headerRef: RefObject<HTMLElement> | null;
  showLoader: boolean;
  scrolledHeader: boolean;
}

export interface WithLayoutProps {
  setHeaderRef: (ref: RefObject<HTMLElement>) => void;
  setScrolledHeader: (arg0: boolean) => void;
  showLoader: boolean;
  setShowLoader: (arg0: boolean) => void;
}

export default function withLayout(
  Component: React.ComponentType<WithLayoutProps>,
): React.ComponentClass<any & WithLayoutProps> {
  return class extends React.Component<WithLayoutProps, LayoutState> {
    constructor(props: WithLayoutProps) {
      super(props);
      this.setHeaderRef = this.setHeaderRef.bind(this);
      this.setShowLoader = this.setShowLoader.bind(this);
      this.setScrolledHeader = this.setScrolledHeader.bind(this);
      this.state = {
        headerRef: null,
        showLoader: true,
        scrolledHeader: false,
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

    setScrolledHeader(scrolledHeader: boolean) {
      this.setState({ scrolledHeader });
    }

    setHeaderRef(headerRef: RefObject<HTMLElement>) {
      this.setState({ headerRef });
    }

    setShowLoader(showLoader: boolean) {
      this.setState({ showLoader });
    }

    // const [headerRef, setHeaderRef] =
    //   useState<MutableRefObject<HTMLElement> | null>(null);
    render() {
      const { headerRef, showLoader, scrolledHeader } = this.state;

      return (
        <div className="font-sans antialiased border-box">
          <Header headerRef={headerRef} scrolledHeader={scrolledHeader} />
          <Component
            {...this.props}
            setScrolledHeader={this.setScrolledHeader}
            setHeaderRef={this.setHeaderRef}
            showLoader={showLoader}
            setShowLoader={this.setShowLoader}
          />
        </div>
      );
    }
  };
}
