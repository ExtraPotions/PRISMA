'use strict';

// Public images contain only the product and its actual built release notes.
module.exports = {
  build: ["scripts/build.cjs"],
  userscript: 'prisma.user.js',
  host: '#exp-prisma-root',
  url: 'https://example.test/',
  page: '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}</style><main></main>',
  viewport: {width:960,height:1400},
  productOnly: true,
  shots: [
    {file:'menu-light.png',section:'Highlights',mode:'light',collapsed:true},
    {file:'menu-dark.png',section:'Highlights',mode:'dark',collapsed:true},
    {file:'changelog.png',section:'Highlights',mode:'dark',collapsed:true,notice:true},
  ],
};
