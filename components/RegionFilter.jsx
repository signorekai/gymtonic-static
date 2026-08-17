import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const ALL_REGIONS = 'all';

// The `region` taxonomy has no meaningful sort order in WordPress (TERM_ORDER
// falls back to term_id), so the display order lives here. Terms that aren't
// listed still render, appended alphabetically, so adding a term in WP admin
// never makes it disappear from the filter.
const preferredOrder = ['central', 'north', 'northeast', 'east', 'west'];

const RegionFilter = ({
  regions,
  activeRegion,
  setActiveRegion,
  variants = {},
  className = '',
}) => {
  const items = useMemo(() => {
    const sorted = [...(regions ?? [])].sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a.slug);
      const bIndex = preferredOrder.indexOf(b.slug);

      if (aIndex === -1 && bIndex === -1) {
        return a.name.localeCompare(b.name);
      }
      if (aIndex === -1) {
        return 1;
      }
      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    });

    return [{ id: ALL_REGIONS, name: 'All', slug: ALL_REGIONS }, ...sorted];
  }, [regions]);

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
