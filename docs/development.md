# PRISMA development

Suite-wide steps (shared Core changes, release order, screenshots, adding a product) are in [exp-core's maintainer guide](https://github.com/ExtraPotions/exp-core/blob/main/docs/development.md). This page covers what is specific to PRISMA.

## Source layout

- `src/` holds the modules. `scripts/build.cjs` lists them in load order and wraps them, with the vendored Core, into `prisma.user.js`. Add a new module to that list.
- `src/catalog-data.js` is the identity catalog. Every entry needs a review record in `docs/catalog-review.json`; [catalog-sources.md](catalog-sources.md) explains the evidence rules, and the catalog provenance test enforces them.
- `src/release-notes.js` holds the in-app release notes and `QUIET_RELEASES`.
- `vendor/exp-core/` is the bundled Core. Change it only by syncing from exp-core.

## Commands

| Task | Command |
|---|---|
| Build | `npm run build` |
| Check the build is current | `npm run build:check` |
| Full suite | `npm test`, or after a build `node --test --test-concurrency=2 tests/*.test.cjs` |
| Release check | `npm run release:check` |
| README screenshots | `npm run screenshots` (exp-core must sit beside PRISMA) |
| Feature release | `RELEASE_NOTES_JSON='["…","…"]' npm run prepare:release:feature` (add `RELEASE_QUIET=1` for a quiet one) |

## Things the checks hold fixed

- The install stays between 100 and 512 KiB, with no `@resource`, `@require` or embedded images.
- README screenshots (`appearance.png`, `highlights-demo.png`) match `docs/screenshots.config.cjs`. Shot routes use current tab names, for example `section: 'Look', tab: 'Style'`.
