/* eslint-disable react/jsx-props-no-spreading */
import { AnimatePresence, motion } from 'framer-motion';
import React, { createContext, useEffect } from 'react';
import Link from 'next/link';

import { menuQuery } from 'pages/[[...page]]';
import { useQuery } from '@apollo/client';
import SignUpBtn from 'components/SignUpButton';
import SignupBtnSrc from 'assets/images/SignUpButtons-1-1.png';
import SignupBtnHoverSrc from 'assets/images/SignUpButtons-1-2.png';
import SignupBtnMobileSrc from 'assets/images/SignUpButtons-Small-1.png';

const MobileNav: React.FunctionComponent<{
  showMobileNav: boolean;
  setShowMobileNav: (arg0: boolean) => void;
  setShowSignUpForm: (arg0: boolean) => void;
}> = ({
  showMobileNav,
  setShowMobileNav,
  setShowSignUpForm,
}: {
  showMobileNav: boolean;
  setShowMobileNav: (arg0: boolean) => void;
  setShowSignUpForm: (arg0: boolean) => void;
}) => {
  const menu = useQuery(menuQuery);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const menuItems: MenuData = menu.data?.menu.menuItems.edges;

  useEffect(() => {
    if (showMobileNav) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      document.querySelector('html')?.classList.add('overflow-hidden');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      document.querySelector('html')?.classList.remove('overflow-hidden');
    }
  }, [showMobileNav]);

  return (
    <AnimatePresence exitBeforeEnter>
      {showMobileNav && (
        <motion.div
          variants={{
            initial: { opacity: 0, y: -40 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.1,
                when: 'beforeChildren',
                duration: 0.2,
              },
            },
            exit: { opacity: 0, y: 40 },
          }}
          role="dialog"
          aria-modal="true"
          initial="initial"
          animate="show"
          exit="exit"
          className="w-screen min-h-screen fixed flex flex-col justify-between top-0 left-0 bg-white z-60">
          <div className="min-h-screen-1/6 relative text-center">
            <motion.button
              onClick={() => {
                setShowMobileNav(false);
              }}
              className="mt-3 inline-block w-7 h-7 md:w-8 md:h-8 md:absolute md:top-6 md:right-6"
              variants={{
                initial: { opacity: 0, y: -100 },
                exit: { opacity: 0, y: -100 },
                show: { opacity: 1, y: 0 },
              }}
              type="button">
              <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28">
                <g transform="translate(1674 2629) rotate(-90)">
                  <g
                    transform="translate(2629 -1674) rotate(90)"
                    fill="none"
                    stroke="#e62d2d"
                    strokeWidth="1.5">
                    <circle cx="14" cy="14" r="14" stroke="none" />
                    <circle cx="14" cy="14" r="13.25" fill="none" />
                  </g>
                  <line
                    x2="14"
                    transform="translate(2619.949 -1664.854) rotate(135)"
                    fill="none"
                    stroke="#e62d2d"
                    strokeWidth="1.5"
                  />
                  <line
                    x2="14"
                    transform="translate(2619.949 -1654.954) rotate(-135)"
                    fill="none"
                    stroke="#e62d2d"
                    strokeWidth="1.5"
                  />
                </g>
              </svg>
            </motion.button>

            <motion.h2
              variants={{
                initial: { opacity: 0, x: -20 },
                exit: { opacity: 0, y: -20 },
                show: { opacity: 1, x: 0 },
              }}
              className="text-2xl md:text-4xl text-red font-black leading-none text-center absolute bottom-0 left-0 w-full">
              Menu
            </motion.h2>
          </div>
          <ul className="flex flex-col text-center items-center antialiased pointer-events-none">
            <motion.li
              variants={{
                initial: { opacity: 0, x: -20 },
                exit: { opacity: 0, y: 20 },
                show: { opacity: 1, x: 0 },
              }}
              className="text-5xl md:text-8xl leading-snug px-4 text-red font-black pointer-events-auto">
              <Link href="/" scroll={false}>
                <a>Home</a>
              </Link>
            </motion.li>
            {menuItems.map(({ node }: MenuData, index: number) => {
              return (
                <motion.li
                  variants={{
                    initial: { opacity: 0, x: -20 },
                    exit: { opacity: 0, y: 20 },
                    show: { opacity: 1, x: 0 },
                  }}
                  key={`${node.id}`}
                  className="text-5xl md:text-8xl leading-snug px-4 text-red font-black pointer-events-auto">
                  <Link href={node.path}>
                    <a
                      role="link"
                      tabIndex={index}
                      onKeyDown={() => {
                        setShowMobileNav(false);
                      }}
                      onClick={() => {
                        setShowMobileNav(false);
                      }}>
                      {node.label}
                    </a>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
          <motion.div
            variants={{
              initial: { opacity: 0, y: 70 },
              exit: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="min-h-screen-1/6 flex flex-col justify-end mb-4 items-center">
            <SignUpBtn
              setShowSignUpForm={setShowSignUpForm}
              src={SignupBtnSrc}
              mobileSrc={SignupBtnMobileSrc}
              hoverSrc={SignupBtnHoverSrc}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export type SetMobileNavContextType = React.Dispatch<
  React.SetStateAction<boolean>
>;

export const SetMobileNavContext = createContext<any>(null);

interface MobileNavState {
  showMobileNav: boolean;
}

export default function withMobileNav<T extends React.Component>(
  Component: React.ComponentType<T>,
): React.ComponentClass<T & WithMobileNavProps & WithSignUpFormProps> {
  return class extends React.Component<
    T & WithMobileNavProps & WithSignUpFormProps,
    MobileNavState
  > {
    constructor(props: T & WithMobileNavProps & WithSignUpFormProps) {
      super(props);
      this.setShowMobileNav = this.setShowMobileNav.bind(this);
      this.state = {
        showMobileNav: false,
      };
    }

    setShowMobileNav(showMobileNav: boolean) {
      this.setState({ showMobileNav });
    }

    render() {
      const { showMobileNav } = this.state;
      const { setShowSignUpForm } = this.props;

      return (
        <>
          <MobileNav
            {...this.props}
            setShowSignUpForm={setShowSignUpForm}
            setShowMobileNav={this.setShowMobileNav}
            showMobileNav={showMobileNav}
          />
          <Component {...this.props} setShowMobileNav={this.setShowMobileNav} />
        </>
      );
    }
  };
}
