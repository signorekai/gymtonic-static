import React from 'react';
import { NextTemplateLoader } from '@wpengine/headless/next';

import WPTemplates from '../../wp-templates/_templates';

/**
 * @todo make conditionalTags available
 */
export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <NextTemplateLoader templates={WPTemplates} />;
}
