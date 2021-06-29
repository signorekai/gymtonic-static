/* eslint-disable react/jsx-props-no-spreading */
import React, { MutableRefObject, RefObject } from 'react';
import { Header } from 'components';

interface LayoutState {
  headerRef: RefObject<HTMLElement> | null;
  showLoader: boolean;
}

export interface WithLayoutProps {
  setHeaderRef: (ref: RefObject<HTMLElement>) => void;
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
      this.state = {
        headerRef: null,
        showLoader: true,
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

    setHeaderRef(ref: RefObject<HTMLElement>) {
      this.setState({ headerRef: ref });
    }

    setShowLoader(showLoader: boolean) {
      this.setState({ showLoader });
    }

    // const [headerRef, setHeaderRef] =
    //   useState<MutableRefObject<HTMLElement> | null>(null);
    render() {
      const { headerRef, showLoader } = this.state;

      return (
        <div className="font-sans antialiased border-box">
          <Header headerRef={headerRef} />
          <Component
            {...this.props}
            setHeaderRef={this.setHeaderRef}
            showLoader={showLoader}
            setShowLoader={this.setShowLoader}
          />
        </div>
      );
    }
  };
}
