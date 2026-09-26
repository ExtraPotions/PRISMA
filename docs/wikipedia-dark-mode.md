# Portal dark-mode regression

Verified on 2026-09-26 against https://en.wikipedia.org/wiki/Portal:LGBTQ in Chromium.

Wikipedia's portal rule `.skin-theme-clientpref-night .ns-100 .mw-parser-output :not(.notheme):not(a)` applies `background:inherit!important` and `color:inherit!important`. Its specificity exceeded PRISMA's gradient stylesheet selector. The background shorthand removed the gradient and reset text clipping to border-box while PRISMA's transparent `-webkit-text-fill-color` remained active. This reproduced with PRISMA alone.

The generic renderer now applies the gradient background and text clipping together as important inline properties on its own highlight wrappers. Style changes, hiding, and high-contrast mode clear these properties through the existing cleanup path. Forced-colors text fill uses sufficient selector specificity to remain opaque.

Live comparison: 219 highlights in all scenarios. Before the fix, 188 had transparent fill with no usable clipped background. After the fix, zero did, with PRISMA alone and with SHIFT in both startup orders. The after screenshot was visually inspected. This verifies Chromium; installed userscript-manager and Firefox behavior remain unverified.

Regression coverage recreates the background-inheritance rule on a generic fixture, changes dark mode after rendering, and checks forced-colors text visibility. All 64 PRISMA tests passed. The reusable gradient protection is provided by exp-core 3.3.4; PRISMA owns foreground colors, accessibility fallbacks, and cleanup. No site-specific exception is used.
