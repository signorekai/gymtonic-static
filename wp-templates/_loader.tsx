import type { Templates } from '@wpengine/headless/react';
import type { NextTemplate } from '@wpengine/headless/next';
import React from 'react';

const templates: Templates<NextTemplate> = {
  '404': import('./404'),
  'front-page': import('./front-page'),
  'page-about': import('./page-about'),
  'page-stories': import('./page-stories'),
  'single-story': import('./page-stories'),
  index: import('./index'),
  category: import('./category'),
  page: import('./page'),
  single: import('./single'),
};

export default templates;
