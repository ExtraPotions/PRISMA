## 3.0.31 - 2026-09-25

- Preserves PRISMA settings across userscript updates by recovering from browser-local backup storage when manager storage is missing.
- Mirrors validated settings to both manager storage and the local fallback so future updates can self-heal without resetting preferences.

## 3.0.30 - 2026-09-25

- Shows each automatic update notice once for that version instead of on every page load.
- Stacks simultaneous notices beside the complete launcher grid.
- Moves diagnostics and data actions under the final System menu.

## 3.0.29 - 2026-09-25

- Keeps every launcher clickable when Dropper and multiple ExtraPotions products share the page.
- Uses exp-core 3.2.19 to prevent transparent launcher containers from intercepting pointer input.

## 3.0.28 - 2026-09-25

- Uses the borderless PRISMA launcher artwork everywhere an icon is shown.
- References the SVG by URL instead of embedding image bytes in the userscript.
- Removes the superseded bordered SVG and raster badge files.

## 3.0.27 - 2026-09-25

- Makes Underline and Soft Fill resilient to hostile page styles.
- Makes the Animation switch visibly affect every highlight style while respecting reduced motion.
- Adds standardized Page, Technical, Console, and Plugin diagnostics with peer conflict reporting.
- Embeds the canonical PRISMA badge for userscript managers.

## 3.0.26 - 2026-09-24

- Removes the decorative progress ring from the PRISMA launcher.
- Keeps the launcher at 48 px with 40 px artwork and the menu badge at 38 px.
- Uses the canonical PRISMA SVG as the userscript-manager icon.

## 3.0.25 - 2026-09-24

- Uses 48 px launcher buttons with 40 px artwork and an 8 px gap between launchers.
- Expands menu-header badge artwork to 38 px.
- Adds a dedicated 128 px raster badge derivative without changing either SVG source.

## 3.0.24 - 2026-09-24

- Restores visible Underline highlights when site styles override PRISMA.
- Restores Soft Fill highlights with their identity color and spacing.
- Keeps both styles visible if the managed page stylesheet cannot paint.

## 3.0.23 - 2026-09-24

- Shows a concise, concrete current-release changelog from the PRISMA version control.
- Includes the same release summary in the update-complete notice after installation.
- Uses concise GitHub release bullets in update-available notices when provided.

## 3.0.22 — 2026-09-24

- Limits shared launcher and theme coordination to the active ExtraPotions products.
- Stops shared audits from tracking the archived CLARITY and Mockingbird repositories.
- Pins the bundled Core reference to the verified Dropper 3.2.13 release artifact.

## 3.0.21 — 2026-09-24

- Packs installed product launchers into Dropper's compact progress rail and restores the normal grid when the obstacle closes.

## 3.0.20 — 2026-09-24

- Adds the locked eight-palette system with deep Crimson and a new PRISMA gem.
- Migrates saved legacy palette names to their closest new direction.

## 3.0.10

- Restyles toggle switches with matte theme surfaces, softer knobs, and restrained accent ON states instead of metallic gray and full-gradient tracks.
- Keeps High Contrast and forced-colors switch behavior explicit for accessibility.
- Matches switch chrome to the active theme instead of using metallic gray tracks or full-gradient Pride ON fills.
- Leaves existing toggle behavior, settings persistence, and panel layout unchanged.

## 3.0.9

- Keeps menu CSS inside the shadow root so userscript style APIs cannot paint the page.
- Pins the launcher host transparent so the browser popover layer cannot cover the site in white.

## 3.0.8

- Dropdown option text matches other menu label text at 11px.

## 3.0.7

- Pride menu uses a full rainbow border, divider, and accents—not just a pink overlay.
- Keeps helper tips inside the viewport when the launcher sits at the top.
- Trims redundant tips from menu section names.

# Changelog

## 3.0.6 — 2026-09-21

- Uses "Your self-identity. Recognized." as the PRISMA subtitle.
- Splits page results into six focused menu routes.
- Strengthens Pride menu palette with muted rainbow accents.
- Keeps underline and soft fill visible over site CSS.
## 3.0.17

- Migrated menu chrome, palettes, diagnostics, and launcher placement to the Dropper 3.2.8 Core contract.
- Preserved the reviewed 124-term catalog, context rules, reversible rendering, and site controls.
- Added browser parity coverage for matte controls, floating notices, and coordinated launchers.
