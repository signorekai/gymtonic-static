/* eslint-disable react/jsx-props-no-spreading */
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useContext, createContext } from 'react';
import Link from 'next/link';

import { menuQuery, MenuData } from 'pages/[[...page]]';
import { useQuery } from '@apollo/client';

const MobileNav: React.FunctionComponent<{ showMobileNav: boolean }> = ({
  showMobileNav,
}: {
  showMobileNav: boolean;
}) => {
  const menu = useQuery(menuQuery);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const menuItems: MenuData = menu.data?.menu.menuItems.edges;

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {showMobileNav && (
          <motion.div
            variants={{
              hide: { opacity: 0, y: -20 },
              show: { opacity: 1, y: 0 },
            }}
            initial="hide"
            animate="show"
            exit="hide"
            className="w-screen min-h-screen fixed flex flex-col justify-between top-0 left-0 bg-white z-40">
            <h2 className="text-2xl md:text-4xl text-red font-black leading-none text-center min-h-screen-1/6 flex flex-col justify-end">
              Menu
            </h2>
            <ul className="flex flex-col text-center items-center antialiased pointer-events-none">
              <li className="text-5xl md:text-8xl leading-snug px-4 uppercase text-red font-black pointer-events-auto">
                <Link href="/" scroll={false}>
                  <a>Home</a>
                </Link>
              </li>
              {menuItems.map(({ node }: MenuData) => {
                return (
                  <li
                    key={`${node.id}`}
                    className="text-5xl md:text-8xl leading-snug px-4 uppercase text-red font-black pointer-events-auto">
                    <Link href={node.path} scroll={false}>
                      <a>{node.label}</a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="min-h-screen-1/6">Hi</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export type SetMobileNavContextType = React.Dispatch<
  React.SetStateAction<boolean>
>;

export const SetMobileNavContext = createContext<any>(null);

export interface WithMobileNavProps {
  setShowMobileNav: (arg0: boolean) => void;
}
interface MobileNavState {
  showMobileNav: boolean;
}

export default function withMobileNav(
  Component: React.ComponentType<WithMobileNavProps>,
): React.ComponentClass<any & WithMobileNavProps> {
  return class extends React.Component<WithMobileNavProps, MobileNavState> {
    constructor(props: WithMobileNavProps) {
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
      return (
        <>
          <MobileNav showMobileNav={showMobileNav} />
          <Component {...this.props} setShowMobileNav={this.setShowMobileNav} />
        </>
      );
    }
  };
}

