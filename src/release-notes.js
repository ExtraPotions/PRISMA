EXP.ReleaseNotes = (() => {
  const notes = Object.freeze({
    '3.0.31': Object.freeze([
      'Preserves PRISMA settings across userscript updates by recovering from browser-local backup storage when manager storage is missing.',
      'Mirrors validated settings to both manager storage and the local fallback so future updates can self-heal without resetting preferences.'
    ]),
    '3.0.30': Object.freeze([
      'Shows each automatic update notice once for that version instead of on every page load.',
      'Stacks simultaneous notices beside the complete launcher grid.',
      'Moves diagnostics and data actions under the final System menu.'
    ]),
    '3.0.29': Object.freeze([
      'Keeps every launcher clickable when multiple ExtraPotions products share the page.',
      'Prevents transparent launcher containers from intercepting pointer input.'
    ]),
    '3.0.28': Object.freeze([
      'Uses the borderless PRISMA launcher artwork everywhere an icon is shown.',
      'References the SVG by URL instead of embedding image bytes in the userscript.',
      'Removes the superseded bordered SVG and raster badge files.'
    ]),
    '3.0.27': Object.freeze([
      'Makes Underline and Soft Fill resilient to hostile page styles.',
      'Makes the Animation switch visibly affect every highlight style while respecting reduced motion.',
      'Adds standardized Page, Technical, Console, and Plugin diagnostics with peer conflict reporting.',
      'Embeds the canonical PRISMA badge for userscript managers.'
    ]),
    '3.0.26': Object.freeze([
      'Removes the decorative progress ring from the PRISMA launcher.',
      'Keeps the launcher at 48 px with 40 px artwork and the menu badge at 38 px.',
      'Uses the canonical PRISMA SVG as the userscript-manager icon.'
    ]),
    '3.0.25': Object.freeze([
      'Uses 48 px launcher buttons with 40 px artwork and an 8 px gap between launchers.',
      'Expands menu-header badge artwork to 38 px.',
      'Adds a dedicated 128 px raster badge derivative without changing either SVG source.'
    ]),
    '3.0.24': Object.freeze([
      'Restores visible Underline highlights when site styles override PRISMA.',
      'Restores Soft Fill highlights with their identity color and spacing.',
      'Keeps both styles visible if the managed page stylesheet cannot paint.'
    ]),
    '3.0.23': Object.freeze([
      'Shows concrete current-release changes when the PRISMA version control is opened.',
      'Includes the same concise changelog after PRISMA finishes updating.',
      'Uses the latest release summary in update-available notices when GitHub provides it.'
    ]),
    '3.0.22': Object.freeze([
      'Limits shared launcher and theme coordination to active ExtraPotions products.',
      'Stops shared audits from tracking archived products.',
      'Pins PRISMA to the verified Dropper 3.2.13 Core reference.'
    ]),
    '3.0.21': Object.freeze([
      'Packs installed product launchers into Dropper\'s compact progress rail.',
      'Restores the normal launcher grid when the progress obstacle closes.'
    ])
  });
  function current() { return notes[EXP.VERSION] || Object.freeze(['Current PRISMA improvements and fixes.']); }
  return Object.freeze({ current });
})();
