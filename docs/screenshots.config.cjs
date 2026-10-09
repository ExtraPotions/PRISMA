'use strict';

// README screenshots, captured by exp-core's shared tool: npm run screenshots

module.exports = {
  build: ['scripts/build.cjs'],
  userscript: 'prisma.user.js',
  host: '#exp-prisma-root',
  url: 'https://sample.test/guide',
  page: '<!doctype html><meta charset="utf-8"><title>Community guide</title><body style="margin:0;font:18px/1.65 system-ui;background:#eef1f7;color:#151827"><main style="max-width:430px;margin:36px;padding:30px 34px;background:#fff;border-radius:16px;box-shadow:0 18px 60px #17305b22"><h1 style="margin-top:0">Community guide</h1><p>The bisexual and pansexual communities are represented here.</p><p>An aromantic identity resource was added recently.</p></main></body>',
  viewport: { width: 900, height: 640 },
  shots: [
    // The sample page with live highlights next to the open Highlights menu.
    { file: 'highlights-demo.png', section: 'Highlights', include: 'page' },
    { file: 'appearance.png', section: 'Appearance', tab: 'Style', viewport: { width: 900, height: 1400 } },
  ],
};
