import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface Props {
  barStyle?: string;
}

const MobileNavBtn: React.FunctionComponent<Props & WithMobileNavProps> = ({
  barStyle = 'text-red',
  setShowMobileNav,
}: Props & WithMobileNavProps) => {
  const bar = `bg-current h-[2px] w-full mb-2 last:mb-0 ${barStyle}`;

  return (
    <motion.button
      type="button"
      className="w-7 lg:hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        setShowMobileNav(true);
      }}>
      <div className={bar} />
      <div className={bar} />
      <div className={bar} />
    </motion.button>
  );
};

export default MobileNavBtn;
