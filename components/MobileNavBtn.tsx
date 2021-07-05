import { ThemeContext, ThemeContextType } from 'pages/_app';
import React, { useContext, useEffect } from 'react';

interface Props {
  barStyle?: string;
}

const MobileNavBtn: React.FunctionComponent<Props> = ({
  barStyle = 'text-red',
}: Props) => {
  const { setShowMobileNav, showMobileNav }: ThemeContextType =
    useContext<ThemeContextType>(ThemeContext);

  const bar = `bg-current h-[2px] w-full mb-2 last:mb-0 ${barStyle}`;

  return (
    <button
      type="button"
      className="w-7 lg:hidden"
      onClick={() => {
        setShowMobileNav(!showMobileNav);
        console.log('hi');
      }}>
      <div className={bar} />
      <div className={bar} />
      <div className={bar} />
    </button>
  );
};

export default MobileNavBtn;
