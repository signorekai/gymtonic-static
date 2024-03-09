import React from 'react';

const templates = {
  '404': import('./404'),
  'front-page': import('./front-page'),
  'page-about': import('./page-about'),
  'page-research': import('./page-research'),
  'page-technology': import('./page-technology'),
  'page-its-simple': import('./page-its-simple'),
  'page-coaches': import('./page-coaches'),
  'page-stories': import('./page-stories'),
  'page-news': import('./page-news'),
  'page-locations': import('./page-locations'),
  'single-location': import('./page-locations'),
  'single-story': import('./page-stories'),
  index: import('./index'),
  category: import('./category'),
  page: import('./page'),
  single: import('./single'),
};

export default templates;
