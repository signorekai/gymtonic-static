import React from 'react';
import { motion } from 'framer-motion';

export const ALL_REGIONS = 'all';

const RegionFilter = ({
  regions,
  activeRegion,
  setActiveRegion,
  variants = {},
  className = '',
}) => {
  // Regions arrive from WordPress already in the admin-defined order, so the
  // only thing added here is the "All" pill, which is not a WP term.
  const items = [
    { id: ALL_REGIONS, name: 'All', slug: ALL_REGIONS },
    ...(regions ?? []),
  ];

  // Nothing to filter by until the taxonomy has terms.
  if (items.length <= 1) {
    return <></>;
  }

  return (
    <motion.nav variants={variants} className={className}>
      <ul className="flex flex-row flex-wrap justify-center items-center">
        {items.map((region) => {
          const active = activeRegion === region.slug;

          return (
            <li key={region.id} className="px-3 md:px-4 pb-1 filter-item">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setActiveRegion(region.slug);
                }}
                className={`text-base font-black leading-none pb-1 transition-colors duration-200 ${
                  active
                    ? 'text-red after:scale-x-100'
                    : 'text-black after:scale-x-0 hover:after:scale-x-100'
                }`}>
                {region.name}
              </button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
};

export default RegionFilter;
