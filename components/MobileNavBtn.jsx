import { motion } from 'framer-motion';
import React from 'react';

const MobileNavBtn = ({ barStyle = 'text-red', setShowMobileNav }) => {
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
