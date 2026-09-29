// ==UserScript==
// @name         PRISMA
// @namespace    https://github.com/ExtraPotions
// @version      3.1.12
// @description  Local LGBTQ+ identity-language recognition with context-aware highlighting.
// @icon         https://raw.githubusercontent.com/ExtraPotions/PRISMA/main/assets/prisma-launcher.svg
// @tag          LGBTQ+
// @tag          highlighting
// @tag          accessibility
// @author       ExtraPotions
// @license      PolyForm-Noncommercial-1.0.0
// @homepageURL  https://github.com/ExtraPotions/PRISMA
// @supportURL   https://github.com/ExtraPotions/PRISMA/issues
// @updateURL    https://github.com/ExtraPotions/PRISMA/releases/latest/download/prisma.user.js
// @downloadURL  https://github.com/ExtraPotions/PRISMA/releases/latest/download/prisma.user.js
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @inject-into  content
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.github.com
// ==/UserScript==
// PRISMA Manager Metadata
// Description: Local LGBTQ+ identity-language recognition with context-aware highlighting.
// Tags: LGBTQ+, highlighting, accessibility

(() => {
'use strict';
const EXP = Object.create(null);

// Native exp-core foundation. Shared UI primitives are owned and maintained here.
const CoreFoundation = (() => {
const LAUNCHER_ORDER_KEY = "exp:v3:launcher-order";
const LAUNCHER_GRID_DELTA_KEY = "exp:v3:launcher-grid-delta";
const PRIDE_RAINBOW = "linear-gradient(90deg,#c84e66,#d07840,#be9f37,#3b8a5f,#3d79a6,#7455a4)";

const PRIDE_RAINBOW_VERTICAL = "linear-gradient(180deg,#c84e66,#d07840,#be9f37,#3b8a5f,#3d79a6,#7455a4)";

const CRIMSON_THEME = Object.freeze({ id:"crimson", name:"Crimson", swatch:"linear-gradient(135deg,#0c0508 0 38%,#941f2f 38% 69%,#2f746e 69% 100%)", canvas:"#0c0508", surface:"#1d090f", primary:"#941f2f", companion:"#5e2144", counterpoint:"#2f746e", interactive:"#b63243", bg:"#0c0508", panel:"#1d090f", line:"#4a1b28", text:"#e5d2d7", muted:"#ae8b94", accent:"#941f2f", accent2:"#b63243", skin:"linear-gradient(135deg,#941f2f 0%,#5e2144 52%,#2f746e 100%)", skinVertical:"linear-gradient(180deg,#941f2f 0%,#5e2144 52%,#2f746e 100%)" });

const UI_THEMES = Object.freeze([
    { id:"ember", name:"Ember", swatch:"linear-gradient(135deg,#120807 0 38%,#c9512c 38% 69%,#b68a32 69% 100%)", canvas:"#120807", surface:"#24100c", primary:"#c9512c", companion:"#8f2d3f", counterpoint:"#b68a32", interactive:"#e16a3b", bg:"#120807", panel:"#24100c", line:"#4e2a22", text:"#f1ddd2", muted:"#b99787", accent:"#c9512c", accent2:"#e16a3b", skin:"linear-gradient(135deg,#c9512c 0%,#8f2d3f 52%,#b68a32 100%)", skinVertical:"linear-gradient(180deg,#c9512c 0%,#8f2d3f 52%,#b68a32 100%)" },
    { id:"midnight", name:"Midnight", swatch:"linear-gradient(135deg,#050a12 0 38%,#3563a3 38% 69%,#348f8b 69% 100%)", canvas:"#050a12", surface:"#0c1726", primary:"#3563a3", companion:"#65558f", counterpoint:"#348f8b", interactive:"#477abd", bg:"#050a12", panel:"#0c1726", line:"#26364b", text:"#d4deeb", muted:"#91a2b7", accent:"#3563a3", accent2:"#477abd", skin:"linear-gradient(135deg,#3563a3 0%,#65558f 52%,#348f8b 100%)", skinVertical:"linear-gradient(180deg,#3563a3 0%,#65558f 52%,#348f8b 100%)" },
    { id:"glacier", name:"Glacier", swatch:"linear-gradient(135deg,#061216 0 38%,#4a9eaa 38% 69%,#92b85b 69% 100%)", canvas:"#061216", surface:"#0d252a", primary:"#4a9eaa", companion:"#5c76a4", counterpoint:"#92b85b", interactive:"#67b7c1", bg:"#061216", panel:"#0d252a", line:"#29464b", text:"#d8ebee", muted:"#8fa9ae", accent:"#4a9eaa", accent2:"#67b7c1", skin:"linear-gradient(135deg,#4a9eaa 0%,#5c76a4 52%,#92b85b 100%)", skinVertical:"linear-gradient(180deg,#4a9eaa 0%,#5c76a4 52%,#92b85b 100%)" },
    { id:"contrast", name:"High contrast", swatch:"linear-gradient(135deg,#000000 0 48%,#ffffff 48% 78%,#ffd400 78% 100%)", canvas:"#000000", surface:"#0a0a0a", primary:"#ffffff", companion:"#bfbfbf", counterpoint:"#ffd400", interactive:"#ffd400", bg:"#000000", panel:"#0a0a0a", line:"#ffffff", text:"#ffffff", muted:"#e0e0e0", accent:"#ffffff", accent2:"#ffd400", skin:"linear-gradient(135deg,#ffffff 0%,#bfbfbf 55%,#ffd400 100%)", skinVertical:"linear-gradient(180deg,#ffffff 0%,#bfbfbf 55%,#ffd400 100%)" },
    { id:"verdant", name:"Verdant", swatch:"linear-gradient(135deg,#06110d 0 38%,#318c61 38% 69%,#2f7f86 69% 100%)", canvas:"#06110d", surface:"#0d2218", primary:"#318c61", companion:"#667c3c", counterpoint:"#2f7f86", interactive:"#49a879", bg:"#06110d", panel:"#0d2218", line:"#28483a", text:"#d7e9df", muted:"#93aa9e", accent:"#318c61", accent2:"#49a879", skin:"linear-gradient(135deg,#318c61 0%,#667c3c 52%,#2f7f86 100%)", skinVertical:"linear-gradient(180deg,#318c61 0%,#667c3c 52%,#2f7f86 100%)" },
    { id:"pride", name:"Pride", swatch:"linear-gradient(135deg,#c84e66 0%,#d07840 16.6%,#be9f37 33.3%,#3b8a5f 50%,#3d79a6 66.6%,#7455a4 100%)", canvas:"#100a12", surface:"#1d1222", primary:"#c34f7d", companion:"#7555a6", counterpoint:"#328c82", interactive:"#dd6793", bg:"#100a12", panel:"#1d1222", line:"#4a2b50", text:"#f0ddea", muted:"#b89db4", accent:"#c34f7d", accent2:"#dd6793", skin:PRIDE_RAINBOW, skinVertical:PRIDE_RAINBOW_VERTICAL },
    { id:"twitch", name:"Twitch", swatch:"linear-gradient(135deg,#18181b 0 48%,#9147ff 48% 78%,#bf94ff 78% 100%)", canvas:"#111114", surface:"#19191e", primary:"#9147ff", companion:"#772ce8", counterpoint:"#bf94ff", interactive:"#bf94ff", bg:"#111114", panel:"#19191e", line:"#34343b", text:"#efeff1", muted:"#adadb8", accent:"#9147ff", accent2:"#bf94ff", skin:"linear-gradient(135deg,#9147ff,#bf94ff)", skinVertical:"linear-gradient(180deg,#9147ff,#bf94ff)", skinMode:"flat" },
    { id:"dropper", name:"Dropper gem", swatch:"linear-gradient(135deg,#0b0713 0 38%,#7a46c8 38% 69%,#2a8c9b 69% 100%)", canvas:"#0b0713", surface:"#171025", primary:"#7a46c8", companion:"#b14589", counterpoint:"#2a8c9b", interactive:"#9864dc", bg:"#0b0713", panel:"#171025", line:"#3c2850", text:"#e8ddf2", muted:"#aa98bb", accent:"#7a46c8", accent2:"#9864dc", skin:"linear-gradient(135deg,#7a46c8 0%,#b14589 52%,#2a8c9b 100%)", skinVertical:"linear-gradient(180deg,#7a46c8 0%,#b14589 52%,#2a8c9b 100%)" }
  ]);
const SHARED_UI_THEMES = Object.freeze(UI_THEMES.slice(0, 6));

function css() {
    return `
      :host { all: initial; }
      * { box-sizing: border-box; }
      .exp-core-theme {
        position: fixed; right: 12px; z-index: 2147483600;
        display: flex; flex-direction: column-reverse; align-items: flex-end;
        width: max-content; max-width: calc(100vw - 24px); gap: 8px;
        --theme-bg:#111114; --theme-panel:#19191e; --theme-raised:#2a2a31; --theme-inset:#0e0e10; --theme-line:#34343b; --theme-text:#efeff1; --theme-muted:#adadb8; --theme-accent:#9147ff; --theme-accent2:#bf94ff; --theme-link:#c6a4ff; --theme-focus:#bf94ff; --theme-onAccent:#111114; --theme-skin:linear-gradient(135deg,#d9b5ff,#9b5af9,#7428e8); --theme-skin-vertical:linear-gradient(180deg,#d9b5ff,#9b5af9,#7428e8); --exp-ui-opacity:1; --exp-menu-width:312px;
        font: 13px/1.42 ui-sans-serif, system-ui, "Segoe UI", sans-serif; color: var(--theme-text);
      }
      .exp-core-theme.open-up { flex-direction: column; }
      [data-exp-part="dock"],
      #tdh-drop-card,
      .update-notice {
        opacity:var(--exp-ui-opacity,var(--dropper-ui-opacity,1));
        transition:opacity .15s ease;
      }
      .progress-stack {
        width:min(var(--exp-menu-width,var(--dropper-width, 312px)), calc(100vw - 24px));
        display:flex; flex-direction:column; align-items:stretch;
        transition:.15s width;
        gap:6px;
      }
      .progress-stack[data-collapsed-width="compact"] { width:min(260px, calc(100vw - 24px)); }
      .progress-stack[data-collapsed-width="narrow"] { width:min(220px, calc(100vw - 24px)); }
      .progress-stack[data-collapsed-width="full"] { width:min(var(--exp-menu-width,var(--dropper-width, 312px)), calc(100vw - 24px)); }
      .exp-core-theme[data-panel-width="compact"] [data-exp-part="dock"],
      .exp-core-theme[data-panel-width="compact"] > .update-notice[data-placement="menu"] {
        width:min(260px, calc(100vw - 24px));
      }
      .exp-core-theme[data-panel-width="narrow"] [data-exp-part="dock"],
      .exp-core-theme[data-panel-width="narrow"] > .update-notice[data-placement="menu"] {
        width:min(220px, calc(100vw - 24px));
      }
      .exp-core-theme[data-panel-width="full"] [data-exp-part="dock"],
      .exp-core-theme[data-panel-width="full"] > .update-notice[data-placement="menu"] {
        width:min(var(--exp-menu-width,var(--dropper-width, 312px)), calc(100vw - 24px));
      }
      .progress-stack.badge-only .badge-row { justify-content:flex-end; min-height:48px!important; }
      .progress-stack.badge-only [data-exp-part="launcher"] {
        border-radius:12px;
        border-left:1px solid color-mix(in srgb, var(--theme-accent) 47%, transparent);
      }
      .badge-only-progress-slot{display:block;width:100%;margin:0 0 5px;min-width:0}
      .badge-only-progress-slot[hidden]{display:none!important}
      .badge-only-progress-slot #tdh-drop-card{position:relative!important;inset:auto!important;display:block!important;width:100%!important;min-width:0!important;max-width:none!important;margin:0!important}
      .compact-line { height:auto; min-height:48px; padding:6px 10px; display:grid; grid-template-columns:6px minmax(0,1fr) auto auto; gap:7px; align-items:center; cursor:pointer; }
      .compact-dot { width:6px; height:6px; border-radius:2px; background:#9147ff; }
      .compact-reward { font-size:10px; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .compact-extra { font-size:9px; color:#b8b8c0; white-space:nowrap; }
      .state-pill { display:inline-flex; align-items:center; border:1px solid #34343a; border-radius:5px; padding:1px 5px; font-size:8px; font-weight:800; color:#d0d0d5; background:#1c1c21; white-space:nowrap; }
      .state-pill.good { color:#c8ffd7; border-color:#22c55e66; background:#22c55e18; }
      .state-pill.warn { color:#ffe5a8; border-color:#f59e0b66; background:#f59e0b18; }
      .state-pill.bad { color:#ffd1d1; border-color:#ef444466; background:#ef444418; }
      .stream-info { padding:7px 9px 6px; display:grid; grid-template-columns:32px minmax(0,1fr); gap:7px; align-items:center; }
      .stream-info-hidden { display:none; }
      .stream-head { min-width:0; display:flex; align-items:center; gap:5px; }
      .stream-channel { font-size:11px; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .stream-live { font-size:8px; font-weight:900; background:#eb0400; color:#fff; border-radius:4px; padding:1px 4px; }
      .stream-title { display:none; }
      .stream-game { font-size:9px; color:#adadb8; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .stream-badges { display:flex; gap:4px; flex-wrap:nowrap; align-items:center; justify-self:end; font-size:8px; color:#8f8f98; }
      .stream-badges[hidden] { display:none !important; }
      .stream-badge { padding:1px 4px; border:1px solid #34343b; border-radius:99px; }
      .stream-badge.drops-enabled { color:#d7ffd7; border-color:#22c55e66; background:#22c55e18; }
      .stream-dot { color:#5f5f68; }
      .drop-section { padding:7px 9px 8px; border-top:1px solid #29292f; }
      .drop-kicker { font-size:8px; color:#bf94ff; font-weight:900; letter-spacing:.07em; text-transform:uppercase; margin-bottom:2px; }
      .drop-head { display:flex; align-items:center; justify-content:space-between; gap:8px; padding-right:24px; }
      .drop-name { font-size:11px; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .drop-game { display:none; }
      .drop-bar-row { margin-top:6px; display:grid; grid-template-columns:minmax(0,1fr) auto; gap:7px; align-items:center; }
      .drop-bar { height:6px; border-radius:99px; background:#2b2b31; overflow:hidden; }
      .drop-bar > span { display:block; height:100%; width:0; background:#9147ff; transition:.2s width,.2s background; }
      .drop-percent { font-size:10px; font-weight:800; color:#bf94ff; min-width:28px; text-align:right; }
      .drop-meta { font-size:8px; color:#9c9ca5; margin-top:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .drop-status-row { margin-top:4px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; font-size:8px; color:#a7a7b0; }
      .progress-age { color:#a7a7b0; }
      .progress-age.warn { color:#f59e0b; }
      .progress-age.bad { color:#ef4444; font-weight:800; }
      /* 3.2.0 progress panel */
      .exp-core-theme{pointer-events:none!important}
      .exp-core-theme :is([data-exp-part="dock"],.update-notice,#tdh-drop-card,[data-exp-part="launcher"]){pointer-events:auto!important}
      .exp-core-theme .progress-stack{height:auto;min-height:48px;pointer-events:none!important}
      .exp-core-theme .badge-row{position:fixed!important;min-height:112px!important;height:auto!important;justify-content:flex-end!important;align-items:center!important;pointer-events:none!important}
      .exp-core-theme #tdh-drop-card[data-presentation="page-card"]{position:relative!important;inset:auto!important;right:auto!important;left:auto!important;top:auto!important;bottom:auto!important;flex:0 0 auto!important;margin:0!important}
      .exp-core-theme .badge-only-progress-slot #tdh-drop-card[data-presentation="menu-card"]{position:relative!important;inset:auto!important;right:auto!important;left:auto!important;width:100%!important;min-width:0!important;max-width:none!important;margin:0!important}

      .badge-row {display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:8px!important;width:100%!important;min-height:112px!important;height:auto!important;position:relative!important}
      #tdh-drop-card {position:relative!important;order:0!important;flex:1 1 auto!important;width:auto!important;min-width:0!important;max-width:none!important;min-height:112px!important;margin:0!important;overflow:hidden!important;isolation:isolate!important;cursor:default!important;background:var(--theme-panel)!important;border:1px solid color-mix(in srgb,var(--theme-line) 94%,var(--theme-accent) 6%)!important;border-radius:12px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.03),inset 0 0 18px rgba(255,255,255,.012),0 8px 28px #0006!important;opacity:1!important;transition:border-color .16s ease,box-shadow .16s ease!important}
      #tdh-drop-card:focus-within{border-color:color-mix(in srgb,var(--theme-line) 72%,var(--theme-accent) 28%)!important}
      #tdh-drop-card::before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;border-radius:inherit;background-image:radial-gradient(circle,rgba(255,255,255,.045) .6px,transparent .7px);background-size:4px 4px;opacity:.18;mix-blend-mode:soft-light}
      #tdh-drop-card::after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;border-radius:inherit;background:linear-gradient(to bottom,rgba(255,255,255,.018),rgba(255,255,255,.004) 28%,transparent 55%);opacity:1}
      #tdh-drop-card .expanded-content{position:relative!important;z-index:1!important;display:block!important}
      #tdh-drop-card .compact-line{display:none!important}
      .stream-info,.stream-info-hidden{min-height:110px!important;padding:10px 11px!important;display:block!important}
      .progress-copy{width:100%!important;min-width:0!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-areas:"head head" "category category" "bar bar" "reward reward" "status status"!important;column-gap:10px!important;row-gap:7px!important}
      .progress-head{grid-area:head!important;min-width:0!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:10px!important;align-items:center!important}
      .stream-channel{min-width:0!important;color:var(--theme-text)!important;font-size:12px!important;font-weight:850!important;line-height:1.15!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
      .progress-head .drop-percent{min-width:38px!important;color:var(--theme-accent2)!important;font-size:12px!important;font-weight:900!important;line-height:1!important;text-align:right!important;white-space:nowrap!important}
      .progress-category{grid-area:category!important;min-width:0!important;color:var(--theme-muted)!important;font-size:9px!important;line-height:1.15!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
      .drop-bar{grid-area:bar!important;height:7px!important;margin:1px 0 0!important;border-radius:3px!important;background:color-mix(in srgb,var(--theme-line) 62%,transparent)!important;overflow:hidden!important}
      .drop-bar>span{display:block!important;height:100%!important;width:0;border-radius:inherit!important;background:var(--theme-accent)!important}
      .progress-reward-row{grid-area:reward!important;min-width:0!important;display:flex!important;align-items:center!important;gap:6px!important;color:var(--theme-muted)!important;font-size:9px!important;line-height:1.15!important}
      .progress-reward-row .drop-meta{margin:0!important;flex:0 0 auto!important;color:var(--theme-muted)!important;font-size:9px!important;white-space:nowrap!important}
      .progress-dot{flex:0 0 auto!important;color:color-mix(in srgb,var(--theme-muted) 78%,transparent)!important}
      .progress-reward-row .drop-name{min-width:0!important;color:var(--theme-muted)!important;font-size:9px!important;font-weight:650!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
      .drop-status-row{grid-area:status!important;min-width:0!important;margin:0!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:8px!important;align-items:center!important;color:var(--theme-muted)!important;font-size:8px!important;line-height:1!important}
      .status-meta-chip{box-sizing:border-box!important;min-width:0!important;height:24px!important;display:flex!important;align-items:center!important;overflow:hidden!important;border:1px solid color-mix(in srgb,var(--theme-line) 88%,var(--theme-accent) 12%)!important;border-radius:6px!important;background:color-mix(in srgb,var(--theme-bg) 94%,var(--theme-panel) 6%)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.018)!important}
      .drop-status-row .state-pill{box-sizing:border-box!important;min-width:0!important;min-height:0!important;height:22px!important;display:inline-flex!important;align-items:center!important;gap:5px!important;padding:0 8px!important;border:0!important;border-radius:0!important;background:transparent!important;color:var(--theme-muted)!important;font-size:8px!important;font-weight:800!important;line-height:1!important;white-space:nowrap!important}
      .drop-status-row .state-pill::before{content:""!important;flex:0 0 auto!important;width:6px!important;height:6px!important;border-radius:2px!important;background:currentColor!important;box-shadow:0 0 7px color-mix(in srgb,currentColor 42%,transparent)!important}
      .drop-status-row .state-pill.good{color:#8fd7a0!important}
      .drop-status-row .state-pill.warn{color:#e4bd6c!important}
      .drop-status-row .state-pill.bad{color:#dc9393!important}
      .status-chip-divider{flex:0 0 auto!important;width:1px!important;height:12px!important;background:color-mix(in srgb,var(--theme-line) 82%,transparent)!important}
      .status-clock-icon{flex:0 0 auto!important;width:10px!important;height:10px!important;margin-left:7px!important;color:color-mix(in srgb,var(--theme-muted) 86%,var(--theme-text) 14%)!important}
      #tdh-updated-ago{box-sizing:border-box!important;min-width:0!important;max-width:100%!important;padding:0 8px 0 4px!important;border:0!important;color:var(--theme-muted)!important;font-size:7.5px!important;font-weight:600!important;font-variant-numeric:tabular-nums!important;line-height:1!important;text-align:left!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
      .skip-streamer-chip{appearance:none!important;box-sizing:border-box!important;height:24px!important;min-height:24px!important;min-width:64px!important;max-width:82px!important;padding:0 9px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;border:1px solid color-mix(in srgb,var(--theme-line) 72%,var(--theme-accent) 28%)!important;border-radius:6px!important;background:color-mix(in srgb,var(--theme-bg) 95%,var(--theme-accent) 5%)!important;color:color-mix(in srgb,var(--theme-text) 84%,var(--theme-accent) 16%)!important;font:800 8px/1 ui-sans-serif,system-ui,sans-serif!important;cursor:pointer!important;white-space:nowrap!important;overflow:hidden!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.018)!important;transition:border-color .14s ease,background .14s ease,color .14s ease,box-shadow .14s ease!important}
      .skip-streamer-chip:hover,.skip-streamer-chip:focus-visible{border-color:color-mix(in srgb,var(--theme-accent) 72%,var(--theme-line) 28%)!important;background:color-mix(in srgb,var(--theme-panel) 88%,var(--theme-accent) 12%)!important;color:var(--theme-accent2)!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--theme-accent) 16%,transparent)!important;outline:none!important}
      .skip-streamer-chip:disabled{opacity:.36!important;cursor:default!important;box-shadow:none!important}
      .skip-streamer-chip .skip-icon{flex:0 0 auto!important;width:10px!important;height:10px!important;fill:currentColor!important}
      .skip-streamer-chip .skip-label{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
      .skip-streamer-chip .skip-countdown{display:inline-grid!important;place-items:center!important;min-width:18px!important;height:16px!important;margin-left:1px!important;padding:0 4px!important;border-radius:4px!important;background:#ef4444!important;color:#fff!important;font-size:6px!important;font-weight:900!important;line-height:1!important}
      .skip-streamer-chip .skip-countdown[hidden]{display:none!important}
      .skip-streamer-chip.is-armed{min-width:78px!important;max-width:92px!important;border-color:color-mix(in srgb,#ef4444 62%,var(--theme-line))!important;background:color-mix(in srgb,var(--theme-panel) 90%,#ef4444 10%)!important;color:#efb0b0!important}
      .skip-streamer-chip.is-armed .skip-icon{display:none!important}
      .progress-stack[data-collapsed-width="compact"] .stream-info{padding:9px 10px!important}
      .progress-stack[data-collapsed-width="compact"] .progress-copy{row-gap:6px!important}
      .progress-stack[data-collapsed-width="compact"] .stream-channel,.progress-stack[data-collapsed-width="compact"] .progress-head .drop-percent{font-size:11px!important}
      .progress-stack[data-collapsed-width="compact"] .progress-category,.progress-stack[data-collapsed-width="compact"] .progress-reward-row,.progress-stack[data-collapsed-width="compact"] .progress-reward-row .drop-meta,.progress-stack[data-collapsed-width="compact"] .progress-reward-row .drop-name{font-size:8px!important}
      .progress-stack[data-collapsed-width="compact"] .drop-status-row{grid-template-columns:minmax(0,1fr) auto!important;gap:5px!important}
      .progress-stack[data-collapsed-width="compact"] .status-meta-chip{height:22px!important}
      .progress-stack[data-collapsed-width="compact"] .drop-status-row .state-pill{height:20px!important;gap:4px!important;padding-inline:6px!important;font-size:7.25px!important}
      .progress-stack[data-collapsed-width="compact"] .drop-status-row .state-pill::before{width:5px!important;height:5px!important}
      .progress-stack[data-collapsed-width="compact"] .status-chip-divider{height:10px!important}
      .progress-stack[data-collapsed-width="compact"] .status-clock-icon{width:8.5px!important;height:8.5px!important;margin-left:5px!important}
      .progress-stack[data-collapsed-width="compact"] #tdh-updated-ago{padding:0 6px 0 3px!important;font-size:6.75px!important}
      .progress-stack[data-collapsed-width="compact"] .skip-streamer-chip{height:22px!important;min-height:22px!important;min-width:49px!important;max-width:56px!important;padding-inline:7px!important;gap:4px!important;font-size:7px!important}
      .progress-stack[data-collapsed-width="compact"] .skip-streamer-chip .skip-icon{width:9px!important;height:9px!important}
      .progress-stack[data-collapsed-width="compact"] .skip-streamer-chip.is-armed{min-width:67px!important;max-width:76px!important;padding-inline:6px!important}
      .progress-stack[data-collapsed-width="narrow"] .stream-info{padding:8px 9px!important}
      .progress-stack[data-collapsed-width="narrow"] .progress-copy{row-gap:5px!important}
      .progress-stack[data-collapsed-width="narrow"] .stream-channel,.progress-stack[data-collapsed-width="narrow"] .progress-head .drop-percent{font-size:10px!important}
      .progress-stack[data-collapsed-width="narrow"] .progress-category,.progress-stack[data-collapsed-width="narrow"] .progress-reward-row,.progress-stack[data-collapsed-width="narrow"] .progress-reward-row .drop-meta,.progress-stack[data-collapsed-width="narrow"] .progress-reward-row .drop-name{font-size:7.25px!important}
      .progress-stack[data-collapsed-width="narrow"] .drop-status-row{grid-template-columns:minmax(0,1fr) auto!important;gap:4px!important}
      .progress-stack[data-collapsed-width="narrow"] .status-meta-chip{height:21px!important}
      .progress-stack[data-collapsed-width="narrow"] .drop-status-row .state-pill{height:19px!important;gap:3px!important;padding-inline:5px!important;font-size:6.6px!important}
      .progress-stack[data-collapsed-width="narrow"] .drop-status-row .state-pill::before{width:4.5px!important;height:4.5px!important;box-shadow:none!important}
      .progress-stack[data-collapsed-width="narrow"] .status-chip-divider{height:9px!important}
      .progress-stack[data-collapsed-width="narrow"] .status-clock-icon{width:8px!important;height:8px!important;margin-left:4px!important}
      .progress-stack[data-collapsed-width="narrow"] #tdh-updated-ago{padding:0 5px 0 2px!important;font-size:6.25px!important}
      .progress-stack[data-collapsed-width="narrow"] .skip-streamer-chip{width:26px!important;min-width:26px!important;max-width:26px!important;height:21px!important;min-height:21px!important;padding:0!important;gap:0!important}
      .progress-stack[data-collapsed-width="narrow"] .skip-streamer-chip .skip-icon{width:10px!important;height:10px!important}
      .progress-stack[data-collapsed-width="narrow"] .skip-streamer-chip:not(.is-armed) .skip-label{display:none!important}
      .progress-stack[data-collapsed-width="narrow"] .skip-streamer-chip.is-armed{width:auto!important;min-width:64px!important;max-width:72px!important;padding-inline:5px!important;gap:3px!important}
      .progress-stack[data-collapsed-width="narrow"] .skip-streamer-chip.is-armed .skip-label{display:inline!important}
      .progress-stack[data-collapsed-width="narrow"] .skip-streamer-chip .skip-countdown{min-width:16px!important;height:14px!important;padding-inline:3px!important;font-size:5.5px!important}

      [data-exp-part="launcher"] {
        position:relative; width:48px; min-width:48px; height:48px; min-height:48px; align-self:flex-end; padding:0; margin:0;
        display:grid; place-items:center; border:1px solid color-mix(in srgb,var(--theme-accent) 30%,transparent); border-radius:10px;
        background:var(--theme-panel,#18181b); box-shadow:0 6px 22px #0006; cursor:grab; touch-action:none; user-select:none;
        transition:.14s border-color,.14s box-shadow,.14s background,.14s transform;
      }
      .action-pair{display:grid;grid-column:1/-1;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:6px}
      #tdh-clear-activity{grid-column:1/-1}
      .action-separator{grid-column:1/-1;width:100%;border:0;border-top:1px solid var(--theme-line,#34343b);margin:8px 0 0}
      .mini-row:has(#tdh-queue-preference){grid-column:1/-1}
      #tdh-queue-preference{width:124px;min-width:124px;max-width:124px;flex:0 0 124px}
      .action-pair>.life-btn{min-width:0;margin:0;white-space:normal}
      .stream-subsection-label{grid-column:1/-1;min-width:0;margin:1px 0 2px;color:var(--theme-accent2);font-size:8px;font-weight:900;line-height:1.2;letter-spacing:.08em;text-transform:uppercase}
      .stream-subsection-label.with-divider{margin-top:7px;padding-top:8px;border-top:1px solid var(--theme-line,#34343b)}
      #tdh-streams-body>.queue-switches,
      #tdh-streams-body>.queue-collapsible,
      #tdh-clear-skipped-streamers{grid-column:1/-1}
      .queue-switches{display:grid;grid-template-columns:minmax(58px,.7fr) minmax(0,1.3fr);column-gap:10px;row-gap:0;min-width:0;margin:6px 0;padding:2px 0;border:0;align-items:stretch}
      .queue-switches-label{grid-column:1;grid-row:1/span 3;display:flex;align-items:center;min-width:0;font-size:11px;font-weight:700;line-height:1.2;color:var(--theme-text,#efeff1)}
      .queue-switches>.fl-switch{grid-column:2;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;gap:10px;min-width:0;padding:5px 0!important;text-align:left!important}
      .queue-switches>.fl-switch>span:first-child{display:block;flex:1 1 auto;width:auto!important;min-width:0!important;min-height:0!important;white-space:normal!important;word-break:normal!important;overflow-wrap:normal!important;line-height:1.25;text-align:left}
      .queue-switches>.fl-switch>.toggleSwitch{flex:0 0 34px;margin-left:auto}
      #tdh-collapsed-width{box-sizing:border-box;width:100%;margin:0;min-width:0!important;max-width:104px!important;flex:0 1 104px}
      #tdh-progress-body{padding-bottom:5px}
      #tdh-progress-body>.fl-switch,
      #tdh-progress-body>.mini-row{padding:4px 0}
      #tdh-diagnostics-body>.mini-row:has(#tdh-collapsed-width){grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,104px);align-items:center;gap:8px}
      #tdh-diagnostics-body>.mini-row:has(#tdh-collapsed-width)>span{flex:1 1 120px;min-width:0;white-space:normal;overflow-wrap:normal}
      #tdh-progress-body>.theme-row{min-height:22px;padding:3px 0;gap:6px}
      #tdh-progress-body .exp-theme-swatches{gap:3px;flex-wrap:nowrap;min-width:0}
      #tdh-progress-body .exp-theme-swatch{flex:0 0 18px!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;max-width:18px!important;max-height:18px!important;border-radius:4px!important}
      .exp-core-theme[data-panel-width="compact"] #tdh-progress-body>.theme-row>span,
      .exp-core-theme[data-panel-width="narrow"] #tdh-progress-body>.theme-row>span{display:none}
      .exp-core-theme[data-panel-width="compact"] #tdh-progress-body>.theme-row,
      .exp-core-theme[data-panel-width="narrow"] #tdh-progress-body>.theme-row{gap:0}
      .exp-core-theme[data-panel-width="compact"] #tdh-progress-body .exp-theme-swatches,
      .exp-core-theme[data-panel-width="narrow"] #tdh-progress-body .exp-theme-swatches{width:100%;justify-content:space-between}
      .exp-core-theme[data-panel-width="narrow"] #tdh-progress-body>.theme-row{gap:4px}
      .exp-core-theme[data-panel-width="narrow"] #tdh-progress-body .exp-theme-swatch{flex-basis:16px!important;width:16px!important;height:16px!important;min-width:16px!important;min-height:16px!important;max-width:16px!important;max-height:16px!important}
      .appearance-separator{grid-column:1/-1;width:100%;border:0;border-top:1px solid var(--theme-line,#34343b);margin:3px 0 1px}
      .opacity-row{grid-column:1/-1;display:grid;grid-template-columns:auto minmax(72px,1fr) auto;align-items:center;gap:6px;min-width:0;padding:4px 0;border-top:1px solid #26262b}
      .opacity-row[hidden]{display:none!important}
      .opacity-row>span{font-size:11px;line-height:1.25;white-space:nowrap}
      [data-exp-part="opacity-range"]{width:100%;min-width:0;accent-color:var(--theme-accent)}
      [data-exp-part="opacity-value"]{min-width:34px;text-align:right;font-size:10px;font-weight:800;color:var(--theme-muted)}
      .exp-core-theme[data-panel-width="narrow"] .opacity-row{grid-template-columns:1fr auto}
      .exp-core-theme[data-panel-width="narrow"] [data-exp-part="opacity-range"]{grid-column:1/-1}
      #tdh-refresh-now,#tdh-reset-session{border-color:#cb6868!important;background:#402020!important;color:#ffd7d7!important}
      [data-exp-part="launcher"]:hover {
        border-color:color-mix(in srgb,var(--theme-accent) 58%,transparent);
        background:color-mix(in srgb,var(--theme-panel,#18181b) 96%,var(--theme-accent) 4%);
        box-shadow:0 8px 24px #0007; transform:scale(1.015);
      }
      [data-exp-part="launcher"][aria-expanded="true"] {
        border-color:color-mix(in srgb,var(--theme-accent) 72%,transparent);
        background:var(--theme-panel,#18181b);
        box-shadow:0 0 0 1px color-mix(in srgb,var(--theme-accent) 22%,transparent),0 8px 26px #0008;
        transform:scale(1.01);
      }
      [data-exp-part="launcher"].is-dragging {
        cursor:grabbing; transform:scale(1.03); box-shadow:0 10px 28px #0009;
      }
      [data-exp-part="launcher"].update-available::after {
        content:"↑"; position:absolute; top:-4px; right:-4px; width:14px; height:14px; display:grid; place-items:center;
        border:2px solid var(--theme-panel,#18181b); border-radius:4px; background:#f59e0b; color:#111114; font-size:8px; font-weight:950;
        box-shadow:0 2px 6px #0007; z-index:4; pointer-events:none;
      }
      [data-exp-part="launcher"] .ring { position:absolute; top:50%; left:50%; width:44px; height:44px; pointer-events:none; transform:translate(-50%,-50%); }
      [data-exp-part="launcher"] .track { fill:none; stroke:color-mix(in srgb,var(--theme-line,#34343b) 72%,transparent); stroke-width:2.5; }
      [data-exp-part="launcher"] .fill { fill:none; stroke:var(--theme-accent,#9147ff); stroke-width:2.5; stroke-linecap:round; transition:.2s stroke; }
      [data-exp-part="launcher"] .icon { position:absolute; top:50%; left:50%; width:40px; height:40px; pointer-events:none; z-index:1; transform:translate(-50%,-50%); }
      [data-exp-part="dock"] {
        position:fixed; right:12px; top:auto; bottom:auto;
        display:none; width:min(var(--exp-menu-width,var(--dropper-width, 312px)), calc(100vw - 24px)); max-width:calc(100vw - 24px);
        height:max-content; min-height:0; max-height:none; overflow-x:hidden; overflow-y:auto; overscroll-behavior:contain; flex:0 0 auto;
        transition:.15s width;
        padding:9px 9px 4px; background:var(--theme-bg); border:1px solid var(--theme-line); border-radius:14px; box-shadow:0 18px 50px #0008; color-scheme:dark;
      }
      [data-exp-part="dock"].fl-rail-open { display:block; height:max-content; min-height:0; max-height:none; }
      [data-exp-part="dock"]:focus { outline:none; }
      [data-exp-part="dock"] :is(.fl-tool-body,.row,.group,.section,.fl-tool-title) { min-width:0; max-width:100%; overflow-wrap:anywhere; }
      [data-exp-part="dock"] :is(input,select,textarea) { min-width:0; max-width:100%; }
      .menu-head {
        position:relative;
        display:grid; grid-template-columns:minmax(0,1fr) auto;
        align-items:start; gap:8px; width:100%;
      }
      .header-actions { display:flex; align-items:flex-start; gap:5px; position:static; }
      .support-wrap { position:static; }
      .support-button, #tdh-support-button, [data-exp-part="close"] {
        width:30px; height:30px; min-width:30px; padding:0;
        border:1px solid #3a3a42; border-radius:8px; background:#151519; color:#b8b8c0;
        cursor:pointer;
      }
      .support-button, #tdh-support-button { display:grid; place-items:center; }
      .support-button svg, #tdh-support-button svg { width:15px; height:15px; fill:currentColor; }
      .support-button:hover, .support-button:focus-visible, #tdh-support-button:hover, #tdh-support-button:focus-visible {
        border-color:var(--theme-accent); color:var(--theme-accent2); background:#211b2b; outline:none;
      }
      .support-popover {
        position:absolute; z-index:14; top:35px; right:0;
        width:min(190px,100%); max-width:100%;
        box-sizing:border-box; padding:8px 9px;
        border:1px solid color-mix(in srgb,var(--theme-accent) 46%,var(--theme-line));
        border-radius:9px; background:var(--theme-panel); color:var(--theme-text);
        box-shadow:0 10px 28px #0009;
      }
      .support-popover[hidden] { display:none; }
      .support-popover strong { display:block; margin-bottom:3px; font-size:10px; }
      .support-popover span { display:block; color:var(--theme-muted); font-size:8px; line-height:1.35; }
      .support-popover a {
        display:flex; align-items:center; justify-content:center; min-height:26px; margin-top:7px; padding:0 9px;
        border:1px solid color-mix(in srgb,var(--theme-accent) 58%,var(--theme-line));
        border-radius:7px; background:color-mix(in srgb,var(--theme-panel) 76%,var(--theme-accent) 24%);
        color:var(--theme-text); text-decoration:none; font-size:9px; font-weight:800;
      }
      .support-popover a:hover, .support-popover a:focus-visible {
        border-color:var(--theme-accent2); outline:none;
        background:color-mix(in srgb,var(--theme-panel) 66%,var(--theme-accent) 34%);
      }
      .header-brand {
        display:grid; grid-template-columns:38px minmax(0,1fr);
        align-items:center; gap:8px; min-width:0; width:100%;
      }
      .header-icon {
        box-sizing:border-box; width:38px; height:38px; display:grid; place-items:center;
        border:1px solid color-mix(in srgb,var(--theme-accent) 48%,var(--theme-line));
        border-radius:9px; background:var(--theme-panel);
        box-shadow:inset 0 0 0 1px color-mix(in srgb,#000 22%,transparent);
      }
      .header-icon .menu-icon { width:38px; height:38px; display:block; }
      .header-copy { min-width:0; overflow:hidden; }
      .header-title-row { display:flex; align-items:center; gap:6px; min-width:0; flex-wrap:wrap; }
      [data-exp-part="title"] { margin:0; font-size:15px; font-weight:800; line-height:1.1; }
      [data-exp-part="version"] {
        min-height:18px; padding:1px 6px; border:1px solid #4a3b61; border-radius:5px;
        background:#1b1721; color:#c9a7ff; cursor:pointer; font:800 8px/1 ui-sans-serif,system-ui,sans-serif;
        white-space:nowrap;
      }
      [data-exp-part="version"]:hover, [data-exp-part="version"]:focus-visible {
        border-color:#9147ff; background:#251d31; color:#fff; outline:none;
      }
      [data-exp-part="subtitle"] {
        margin-top:2px; font-size:9px; line-height:1.2; color:#adadb8;
        white-space:normal; overflow-wrap:anywhere;
      }
      [data-exp-part="close"] { font:18px/1 Arial,sans-serif; }
      [data-exp-part="close"]:hover, [data-exp-part="close"]:focus-visible { border-color:#9147ff; color:#fff; background:#211b2b; outline:none; }
      .header-divider { height:1px; width:100%; margin:5px 0; background:linear-gradient(90deg,transparent,#9147ff88 50%,transparent); }
      .update-notice {
        position:fixed; display:block; width:100%; max-width:calc(100vw - 24px); margin:0; padding:10px;
        box-sizing:border-box;
        border:1px solid color-mix(in srgb,var(--theme-accent) 62%,var(--theme-line)); border-radius:10px;
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb,var(--theme-panel) 88%,var(--theme-accent) 12%),
            var(--theme-bg) 76%
          );
        color:var(--theme-text);
        box-shadow:0 10px 28px #0008; z-index:12;
      }
      .update-notice[hidden] { display:none; }
      .update-head { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding-right:22px; }
      .update-heading { min-width:0; }
      .update-kicker { margin-bottom:2px; color:var(--theme-accent2); font-size:8px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
      .update-title { font-size:12px; line-height:1.25; font-weight:850; color:var(--theme-text); }
      .update-version {
        flex:none; padding:2px 6px;
        border:1px solid color-mix(in srgb,var(--theme-accent) 62%,var(--theme-line));
        border-radius:5px;
        background:color-mix(in srgb,var(--theme-panel) 82%,var(--theme-accent) 18%);
        color:var(--theme-text);
        font-size:8px; font-weight:800; white-space:nowrap;
      }
      .update-text { margin-top:6px; font-size:9px; line-height:1.45; color:var(--theme-muted); white-space:normal; overflow:visible; }
      .update-list { margin:7px 0 0; padding:0 0 0 15px; max-height:86px; overflow:auto; color:var(--theme-text); font-size:9px; line-height:1.4; scrollbar-width:thin; }
      .update-list li::marker { color:var(--theme-accent); }
      .update-list li + li { margin-top:3px; }
      .update-footer { display:flex; justify-content:flex-end; gap:6px; margin-top:8px; padding-top:7px; border-top:1px solid var(--theme-line); }
      .update-action, .update-release, .update-dismiss, .life-btn {
        border:1px solid var(--theme-line); border-radius:7px;
        background:var(--theme-bg); color:var(--theme-text); cursor:pointer;
      }
      .update-action, .update-release { min-height:27px; padding:0 10px; font-size:9px; font-weight:800; }
      .update-action { display:inline-flex; align-items:center; justify-content:center; text-decoration:none; }
      .update-action[hidden], .update-release[hidden] { display:none; }
      .update-action {
        border-color:var(--theme-accent);
        background:color-mix(in srgb,var(--theme-panel) 68%,var(--theme-accent) 32%);
        color:var(--theme-text);
      }
      .update-release {
        border-color:color-mix(in srgb,var(--theme-line) 78%,var(--theme-accent) 22%);
        background:var(--theme-panel);
        color:var(--theme-text);
      }
      .update-dismiss {
        position:absolute; top:7px; right:7px; width:23px; height:23px; padding:0;
        border-color:transparent; background:transparent; color:var(--theme-muted); font-size:15px; line-height:1;
      }
      .update-action:hover,
      .update-action:focus-visible,
      .update-release:hover,
      .update-release:focus-visible,
      .update-dismiss:hover,
      .update-dismiss:focus-visible,
      .life-btn:hover {
        border-color:var(--theme-accent);
        color:var(--theme-text);
        outline:none;
      }
      .update-action:hover,
      .update-action:focus-visible {
        background:color-mix(in srgb,var(--theme-panel) 55%,var(--theme-accent) 45%);
      }
      .update-release:hover,
      .update-release:focus-visible {
        background:color-mix(in srgb,var(--theme-panel) 88%,var(--theme-accent) 12%);
      }
            .exp-core-theme[data-theme-skin="gradient"] .update-notice {
        border:1px solid transparent;
        background-image:linear-gradient(var(--theme-panel),var(--theme-panel)),var(--theme-skin);
        background-origin:border-box;
        background-clip:padding-box,border-box;
      }
      .exp-core-theme[data-theme-skin="gradient"] .update-version,
      .exp-core-theme[data-theme-skin="gradient"] .update-action {
        border-color:transparent;
        background-image:linear-gradient(var(--theme-panel),var(--theme-panel)),var(--theme-skin);
        background-origin:border-box;
        background-clip:padding-box,border-box;
      }
      .toast { margin-bottom:7px; padding:6px 8px; border:1px solid #34343b; border-radius:8px; background:#18181b; color:#efeff1; font-size:9px; box-shadow:0 8px 24px #0006; }
      .toast[hidden] { display:none; }
      .fl-tool-panel { position:relative; margin-top:5px; border:1px solid #27272d; background:#19191e; border-radius:9px; overflow:visible; }
      .fl-tool-header { display:flex; justify-content:space-between; align-items:flex-start; height:auto; min-height:0; padding:7px 8px; cursor:pointer; border-radius:8px; }
      .fl-tool-header:hover { background:#9147ff18; }
      .fl-tool-header.last-opened { box-shadow:inset 3px 0 0 #b783ff; }
      .fl-tool-title { min-width:0; flex:1; font-size:12px; font-weight:700; white-space:normal; overflow-wrap:anywhere; }
      .fl-tool-chevron { background:none; border:0; color:#adadb8; cursor:pointer; }
      .fl-tool-body { padding:0 10px 8px; }
      .fl-tool-body:not(.fl-tool-hidden) { display:grid; height:auto; min-height:0; max-height:none; overflow:visible; grid-template-columns:repeat(2,minmax(0,1fr)); align-items:stretch; column-gap:8px; }
      .exp-core-theme[data-panel-width="compact"] .fl-tool-body:not(.fl-tool-hidden),
      .exp-core-theme[data-panel-width="narrow"] .fl-tool-body:not(.fl-tool-hidden) { grid-template-columns:minmax(0,1fr); }
      .exp-core-theme[data-panel-width="compact"] .fl-tool-body:not(.fl-tool-hidden) > *,
      .exp-core-theme[data-panel-width="narrow"] .fl-tool-body:not(.fl-tool-hidden) > * { grid-column:1/-1; }
      .fl-tool-body > :is(.fl-switch,.mini-row,.life-btn) { min-width:0; }
      .fl-tool-body > :is(.compact-inventory,.campaign-manager,.diag) { grid-column:1/-1; }
      #tdh-diagnostics-body { padding-bottom:2px; }
      #tdh-diagnostics-body > [data-dropper-tools] { grid-column:1/-1; min-width:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; align-items:stretch; }
      #tdh-diagnostics-body > [data-dropper-tools]:not(:has(> details[open])) { grid-auto-rows:1fr; }
      #tdh-diagnostics-body>[data-dropper-tools]>details[open]{grid-column:1/-1!important}
      #tdh-diagnostics-body>[data-dropper-tools]>details:not([open]){grid-column:auto!important}
      #tdh-diagnostics-body > [data-dropper-tools] > details { min-width:0; margin-top:0!important; padding:7px!important; border:1px solid var(--theme-line);border-radius:7px;overflow-wrap:anywhere; }
      #tdh-diagnostics-body > [data-dropper-tools] :is(button,select) { max-width:100%; min-width:0; white-space:normal; }
      .exp-core-theme[data-panel-width="narrow"] #tdh-diagnostics-body > [data-dropper-tools] { grid-template-columns:minmax(0,1fr); }
      .fl-tool-hidden { display:none !important; }
      .fl-switch, .mini-row { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; height:auto; min-height:0; padding:6px 0; }
      .fl-switch + .fl-switch, .mini-row + .mini-row { border-top:1px solid #26262b; }
      .fl-switch-text, .mini-row > span {
        min-width:0;
        font-size:11px;
        line-height:1.25;
        white-space:normal;
        word-break:normal;
        overflow-wrap:break-word;
        hyphens:none;
      }
      .toggleSwitch {
        position:relative; box-sizing:border-box; flex:none; width:34px; height:20px;
        border:1px solid color-mix(in srgb,var(--theme-line) 88%,var(--theme-muted) 12%);
        border-radius:6px;
        background:color-mix(in srgb,var(--theme-bg) 84%,var(--theme-panel) 16%);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.018);
        cursor:pointer;
        transition:.15s background,.15s border-color;
      }
      .toggleSwitch::after {
        content:""; position:absolute; top:2px; left:2px; width:14px; height:14px;
        box-sizing:border-box; border:0; border-radius:4px;
        background:color-mix(in srgb,var(--theme-muted) 82%,var(--theme-text) 18%);
        box-shadow:none;
        transition:.15s transform,.15s background;
      }
      .toggleSwitch[aria-checked="true"] {
        border-color:color-mix(in srgb,var(--theme-line) 52%,var(--theme-accent) 48%);
        background:color-mix(in srgb,var(--theme-panel) 72%,var(--theme-accent) 28%);
      }
      .toggleSwitch[aria-checked="true"]::after {
        transform:translateX(14px);
        background:var(--theme-text);
      }
      .life-btn { width:100%; min-height:28px; margin-top:6px; font-size:11px; }
      .life-btn.last-opened { box-shadow:inset 3px 0 0 #b783ff; }
      .select-lite { min-width:0; max-width:72px; background:#111114; color:#efeff1; border:1px solid #34343b; border-radius:6px; padding:4px 6px; font-size:11px; }
      .auth-required {
        grid-column:1/-1;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        margin-top:6px;
        padding:7px 8px;
        border:1px solid color-mix(in srgb,#f59e0b 46%,var(--theme-line));
        border-radius:7px;
        background:color-mix(in srgb,var(--theme-panel) 84%,#f59e0b 16%);
        color:#ffe5a8;
        font-size:10px;
        font-weight:800;
      }
      .auth-required[hidden] { display:none !important; }
      .auth-required .life-btn {
        width:auto;
        min-width:112px;
        margin:0;
        flex:0 0 auto;
      }
      #tdh-toggle-inventory,
      #tdh-refresh-campaign-data { grid-column:1/-1; }
      .auth-advanced { margin-top:2px; border:1px solid var(--theme-line); border-radius:7px; background:var(--theme-inset); padding:6px 8px; }
      .auth-advanced > summary { cursor:pointer; list-style:none; color:var(--theme-muted); font-size:11px; font-weight:600; user-select:none; }
      .auth-advanced > summary::-webkit-details-marker { display:none; }
      .auth-advanced[open] > summary { margin-bottom:6px; color:var(--theme-text); }
      .auth-advanced-body { display:flex; flex-direction:column; gap:6px; }
      .auth-hint { color:var(--theme-muted); font-size:10px; line-height:1.35; }
      .auth-input { width:100%; min-height:30px; border:1px solid var(--theme-line); border-radius:6px; background:var(--theme-inset); color:var(--theme-text); padding:6px 8px; font-size:11px; }
      .auth-input:focus { outline:2px solid var(--theme-focus); outline-offset:2px; border-color:var(--theme-focus); }
      .theme-row { grid-column:1/-1; display:flex; align-items:center; justify-content:space-between; gap:10px; min-height:28px; padding:6px 0; font-size:11px; }
      .exp-theme-swatch{box-sizing:border-box!important;flex:0 0 22px!important;width:22px!important;height:22px!important;min-width:22px!important;min-height:22px!important;max-width:22px!important;max-height:22px!important;padding:0!important;border-radius:5px!important}
      .exp-theme-swatches { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
      .exp-theme-swatch { appearance:none; width:18px; height:18px; min-width:18px; padding:0; border:2px solid var(--theme-line); border-radius:4px; box-sizing:border-box; cursor:pointer; }
      .exp-theme-swatch.is-on { border-color:var(--theme-text); box-shadow:0 0 0 2px var(--theme-accent); }
      .fl-tool-panel { border-color:var(--theme-line); background:var(--theme-panel); }
      .fl-tool-body { border-color:var(--theme-line); background:var(--theme-bg); color:var(--theme-text); }
      .select-lite, .life-btn { border-color:var(--theme-line); background:var(--theme-raised); color:var(--theme-text); }
      .exp-core-theme a { color:var(--theme-link); }
      .fl-tool-chevron, [data-exp-part="subtitle"], .compact-extra { color:var(--theme-muted); }
      .exp-core-theme[data-ui-theme="contrast"] .toggleSwitch { border:2px solid #fff; background:#050505; }
      .exp-core-theme[data-ui-theme="contrast"] .toggleSwitch::after { top:0; left:0; border:1px solid #050505; background:#fff; }
      .exp-core-theme[data-ui-theme="contrast"] .toggleSwitch[aria-checked="true"] { background:#fff; border-color:#fff; }
      .exp-core-theme[data-ui-theme="contrast"] .toggleSwitch[aria-checked="true"]::after { background:#050505; border-color:#fff; transform:translateX(14px); }
      @media (forced-colors: active) {
        .toggleSwitch { forced-color-adjust:none; border:1px solid CanvasText; background:Canvas; }
        .toggleSwitch::after { border-color:CanvasText; background:CanvasText; }
        .toggleSwitch[aria-checked="true"] { border-color:Highlight; background:Highlight; }
        .toggleSwitch[aria-checked="true"]::after { border-color:HighlightText; background:HighlightText; }
      }
            .exp-core-theme[data-theme-skin="gradient"] [data-exp-part="dock"] {
        border:1px solid transparent !important;
        background-origin:border-box !important;
        background-clip:padding-box, border-box !important;
        background-image:linear-gradient(var(--theme-bg),var(--theme-bg)),var(--theme-skin) !important;
      }
      .exp-core-theme[data-theme-skin="gradient"] [data-exp-part="launcher"] {
        border-color:color-mix(in srgb,var(--theme-accent) 30%,transparent) !important;
        background:var(--theme-panel) !important;
        background-image:none !important;
      }
      .exp-core-theme[data-theme-skin="gradient"] [data-exp-part="launcher"]:hover {
        border-color:color-mix(in srgb,var(--theme-accent) 58%,transparent) !important;
        background:color-mix(in srgb,var(--theme-panel) 96%,var(--theme-accent) 4%) !important;
        background-image:none !important;
      }
      .exp-core-theme[data-theme-skin="gradient"] [data-exp-part="launcher"][aria-expanded="true"] {
        border:1px solid transparent !important;
        background-image:linear-gradient(var(--theme-panel),var(--theme-panel)),var(--theme-skin) !important;
        background-origin:border-box !important;
        background-clip:padding-box,border-box !important;
      }
      .exp-core-theme[data-theme-skin="gradient"] [data-exp-part="version"] {
        border:1px solid var(--theme-line);
        background:var(--theme-bg);
        color:var(--theme-text);
        border-radius:6px;
      }
      .exp-core-theme[data-theme-skin="gradient"] [data-exp-part="version"]:hover,
      .exp-core-theme[data-theme-skin="gradient"] [data-exp-part="version"]:focus-visible {
        border-color:transparent;
        background-image:linear-gradient(var(--theme-panel),var(--theme-panel)),var(--theme-skin);
        background-origin:border-box;
        background-clip:padding-box,border-box;
      }
      .exp-core-theme[data-theme-skin="gradient"] .header-divider {
        height:2px;
        border-radius:2px;
        opacity:.9;
        background:var(--theme-skin);
        -webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 16%,#000 84%,transparent 100%);
        mask-image:linear-gradient(90deg,transparent 0%,#000 16%,#000 84%,transparent 100%);
      }
      .exp-core-theme[data-theme-skin="gradient"] .drop-bar > span {
        background:var(--theme-accent) !important;
      }
      .exp-core-theme[data-theme-skin="gradient"] .progress-head .drop-percent {
        color:var(--theme-accent2) !important;
      }
      .exp-core-theme[data-theme-skin="gradient"]:not([data-ui-theme="contrast"]) .toggleSwitch[aria-checked="true"] {
        border-color:color-mix(in srgb,var(--theme-line) 52%,var(--theme-accent) 48%);
        background:color-mix(in srgb,var(--theme-panel) 72%,var(--theme-accent) 28%);
      }
      .exp-core-theme[data-theme-skin="gradient"] .exp-theme-swatch.is-on {
        border-color:var(--theme-text);
        box-shadow:0 0 0 2px var(--theme-accent2);
      }
      .exp-core-theme[data-theme-skin="gradient"] :is(.fl-tool-header,.life-btn).last-opened {
        box-shadow:none;
        position:relative;
      }
      .exp-core-theme[data-theme-skin="gradient"] :is(.fl-tool-header,.life-btn).last-opened::before {
        content:"";
        position:absolute;
        left:0;
        top:4px;
        bottom:4px;
        width:2px;
        border-radius:2px;
        background:var(--theme-skin-vertical);
      }
      .exp-core-theme[data-theme-skin="gradient"] .fl-tool-header:hover,
      .exp-core-theme[data-theme-skin="gradient"] .fl-tool-header:focus-visible,
      .exp-core-theme[data-theme-skin="gradient"] .fl-tool-header[aria-expanded="true"] {
        background:color-mix(in srgb,var(--theme-panel) 88%,var(--theme-accent) 12%);
      }
      .exp-core-theme[data-theme-skin="gradient"] :is(.life-btn,.select-lite,.auth-input):focus-visible,
      .exp-core-theme[data-theme-skin="gradient"] .skip-streamer-chip:focus-visible {
        outline:2px solid transparent !important;
        border-color:transparent !important;
        background-origin:border-box !important;
        background-clip:padding-box,border-box !important;
        background-image:linear-gradient(var(--theme-bg),var(--theme-bg)),var(--theme-skin) !important;
      }
      .exp-core-theme[data-ui-theme="warm"] [data-exp-part="dock"] {
        border:1px solid color-mix(in srgb,var(--theme-line) 84%,var(--theme-accent) 16%) !important;
        background-image:
          radial-gradient(120% 65% at 50% -18%,color-mix(in srgb,var(--theme-accent) 9%,transparent),transparent 72%),
          linear-gradient(180deg,color-mix(in srgb,var(--theme-panel) 42%,var(--theme-bg) 58%),var(--theme-bg) 44%) !important;
        background-clip:padding-box !important;
        box-shadow:0 18px 50px #0009,inset 0 1px 0 #ffedcf12;
      }
      .exp-core-theme[data-ui-theme="warm"] .header-icon {
        background:linear-gradient(155deg,color-mix(in srgb,var(--theme-accent) 13%,var(--theme-panel)),var(--theme-panel) 70%);
        box-shadow:inset 0 1px 0 #ffedcf20,0 2px 9px #0005;
      }
      .exp-core-theme[data-ui-theme="warm"] [data-exp-part="version"] {
        border-color:color-mix(in srgb,var(--theme-line) 66%,var(--theme-accent) 34%);
        background:color-mix(in srgb,var(--theme-panel) 88%,var(--theme-accent) 12%);
        color:var(--theme-accent2);
      }
      .exp-core-theme[data-ui-theme="warm"] [data-exp-part="close"] {
        border-color:var(--theme-line);background:var(--theme-panel);color:var(--theme-muted);
      }
      .exp-core-theme[data-ui-theme="warm"] .header-divider {
        background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--theme-accent) 55%,transparent) 50%,transparent);
      }
      .exp-core-theme[data-ui-theme="warm"] :is(.fl-tool-header,.life-btn):not(.last-opened) {
        box-shadow:inset 0 1px 0 #ffedcf0a;
      }
      .exp-core-theme[data-ui-theme="contrast"] .toggleSwitch[aria-checked="true"] {
        background:#fff;
        border-color:#fff;
      }
      .exp-core-theme[data-ui-theme="contrast"] .toggleSwitch[aria-checked="true"]::after {
        background:#050505;
        border-color:#fff;
      }
      .compact-inventory { display:none; margin-top:6px; border:1px solid #9147ff55; background:#111114; border-radius:9px; overflow:hidden; }
      .compact-inventory.open { display:block; }
      .campaign-manager { margin-top:6px; border:1px solid color-mix(in srgb,var(--theme-accent) 34%,var(--theme-line)); border-radius:9px; background:var(--theme-bg); overflow:hidden; }
      .campaign-manager > summary { list-style:none; display:flex; align-items:center; justify-content:space-between; gap:8px; padding:7px 8px; cursor:pointer; }
      .campaign-manager > summary::-webkit-details-marker { display:none; }
      .campaign-manager-title { min-width:0; font-size:11px; font-weight:800; color:var(--theme-text); }
      .campaign-manager-summary { flex:0 0 auto; font-size:8px; font-weight:700; color:var(--theme-muted); }
      .campaign-manager[open] > summary { border-bottom:1px solid var(--theme-line); }
      .campaign-manager-note { padding:6px 8px 3px; font-size:8px; line-height:1.35; color:var(--theme-muted); }
      .eligibility-chip {
        grid-column:1/-1; margin-top:6px;
        border:1px solid color-mix(in srgb,var(--theme-line) 68%,var(--theme-accent) 32%);
        border-radius:8px; background:var(--theme-panel); overflow:hidden;
      }
      .eligibility-chip > summary {
        list-style:none; display:flex; align-items:center; gap:6px; min-height:28px;
        box-sizing:border-box; padding:5px 8px; cursor:pointer;
        color:var(--theme-text); font-size:9px; font-weight:800;
      }
      .eligibility-chip > summary::-webkit-details-marker { display:none; }
      .eligibility-chip > summary::after {
        content:"▸"; margin-left:auto; color:var(--theme-muted); font-size:9px; transition:.12s transform;
      }
      .eligibility-chip[open] > summary::after { transform:rotate(90deg); }
      .eligibility-chip[data-tone="good"] { border-color:color-mix(in srgb,#3ac978 58%,var(--theme-line)); }
      .eligibility-chip[data-tone="warn"] { border-color:color-mix(in srgb,#e2b34a 58%,var(--theme-line)); }
      .eligibility-chip[data-tone="bad"] { border-color:color-mix(in srgb,#df5b65 58%,var(--theme-line)); }
      .eligibility-chip[data-tone="muted"] { border-color:var(--theme-line); }
      .eligibility-detail {
        padding:0 8px 7px; border-top:1px solid var(--theme-line);
        color:var(--theme-muted); font-size:8px; line-height:1.4;
      }
      .eligibility-detail[hidden] { display:none; }
      .campaign-game-list { max-height:240px; overflow:auto; padding:2px 7px 6px; }
      .campaign-game-row { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:8px; align-items:center; min-height:36px; padding:6px 0; }
      .campaign-game-row + .campaign-game-row { border-top:1px solid #242429; }
      .campaign-game-copy { min-width:0; }
      .campaign-game-name { overflow:hidden; color:var(--theme-text); font-size:10px; font-weight:800; text-overflow:ellipsis; white-space:nowrap; }
      .campaign-game-meta { margin-top:2px; color:var(--theme-muted); font-size:8px; line-height:1.3; }
      .campaign-ignore-check { position:relative; box-sizing:border-box; width:22px; height:22px; padding:0; border:1px solid var(--theme-line); border-radius:6px; background:var(--theme-panel); color:var(--theme-text); cursor:pointer; }
      .campaign-ignore-check::after { content:""; position:absolute; inset:4px; border-radius:3px; background:transparent; }
      .campaign-ignore-check[aria-checked="true"] { border-color:var(--theme-accent); background:color-mix(in srgb,var(--theme-panel) 70%,var(--theme-accent) 30%); }
      .campaign-ignore-check[aria-checked="true"]::after { content:"✓"; display:grid; place-items:center; inset:0; background:transparent; color:var(--theme-text); font-size:13px; font-weight:900; }
      .campaign-ignore-check:focus-visible { outline:2px solid var(--theme-accent2); outline-offset:2px; }
      .inventory-head { padding:7px 8px; border-bottom:1px solid #2a2a30; display:flex; align-items:center; justify-content:space-between; gap:8px; }
      .inventory-head strong { font-size:11px; }
      .inventory-head span { font-size:9px; color:#adadb8; }
      .inventory-list { padding:3px 7px 6px; }
      .inventory-item { display:grid; grid-template-columns:24px minmax(0,1fr) auto; gap:7px; align-items:center; padding:6px 0; }
      .inventory-item + .inventory-item { border-top:1px solid #242429; }
      .reward-thumb { width:24px; height:24px; border-radius:6px; background:linear-gradient(135deg,#9147ff,#5c16c5); display:grid; place-items:center; font-size:9px; font-weight:900; color:#fff; }
      .reward-copy { min-width:0; }
      .reward-name { font-size:10px; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .reward-meta { margin-top:1px; font-size:8px; color:#adadb8; }
      .reward-state { font-size:8px; font-weight:800; color:#bf94ff; white-space:nowrap; }
      .queue-list { display:block; }
      .queue-collapsible {
        grid-column:1/-1;
        margin-top:6px;
        border:1px solid color-mix(in srgb,var(--theme-accent) 34%,var(--theme-line));
        border-radius:9px;
        background:var(--theme-bg);
        overflow:hidden;
      }
      .queue-collapsible > summary {
        list-style:none;
      }
      .queue-collapsible > summary::-webkit-details-marker {
        display:none;
      }
      .queue-summary-head {
        min-height:32px;
        padding:7px 8px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        cursor:pointer;
        user-select:none;
      }
      .queue-summary-head:hover,
      .queue-summary-head:focus-visible {
        background:color-mix(in srgb,var(--theme-panel) 88%,var(--theme-accent) 12%);
        outline:none;
      }
      .queue-summary-head > div {
        min-width:0;
        display:flex;
        align-items:baseline;
        gap:4px;
      }
      .queue-summary-head strong {
        font-size:10px;
        white-space:nowrap;
      }
      .queue-summary-head span:not(.queue-summary-chevron) {
        min-width:0;
        color:var(--theme-muted);
        font-size:8px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .queue-summary-chevron {
        flex:0 0 auto;
        color:var(--theme-muted);
        font-size:11px;
        transition:.15s transform;
      }
      .queue-collapsible[open] .queue-summary-chevron {
        transform:rotate(90deg);
      }
      .queue-collapsible[open] .inventory-list {
        border-top:1px solid var(--theme-line);
      }
      .diag { display:none; box-sizing:border-box;width:100%;min-width:0;height:160px;max-height:160px;overflow:auto;overscroll-behavior:contain;overflow-wrap:anywhere;box-shadow:inset 0 2px 6px #0006; margin-top:6px; padding:7px; border:1px solid #2b2b31; border-radius:7px; background:#101014; font:9px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace; color:#b8b8c0; white-space:pre-wrap; }
      .diag.open { display:block; }
      .has-tooltip { position:relative; }
      .has-tooltip::after { content:attr(data-tip); position:absolute; left:0; top:calc(100% + 4px); width:min(190px, calc(100vw - 48px)); max-width:100%; padding:6px 8px; border:1px solid #3b3b44; border-radius:7px; background:#0e0e10; color:#efeff1; box-shadow:0 6px 18px #0007; box-sizing:border-box; font-size:10px; line-height:1.35; white-space:normal; overflow-wrap:anywhere; opacity:0; pointer-events:none; z-index:999; transform:translateY(-2px); transition:.12s opacity,.12s transform; }
      .has-tooltip:hover::after, .has-tooltip:focus-visible::after { opacity:1; transform:translateY(0); }
      .reduce-motion *, .reduce-motion *::before, .reduce-motion *::after { animation:none !important; transition:none !important; }
      @media (max-width:700px) {
        .badge-row { width:100%; }
        #tdh-drop-card { flex:1 1 auto; width:auto; min-width:0; max-width:none; }
      }
    `;
  }

function protectLauncherHost(host) {
    host = host?.getRootNode?.().host || host;
    if (!host || host.nodeType !== 1) return () => {};
    host.dataset.expOwned = '1';
    const shadow = host.shadowRoot;
    const hostCss = `:host{all:initial!important;position:fixed!important;top:0!important;left:0!important;right:auto!important;bottom:auto!important;display:block!important;width:0!important;height:0!important;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;border:0!important;overflow:visible!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:2147483647!important;isolation:isolate!important;transform:none!important;filter:none!important;clip:auto!important;clip-path:none!important;contain:none!important;content-visibility:visible!important;mix-blend-mode:normal!important}`;
    let protectionSheet = null;
    let protectionStyle = null;
    let repairing = false;
    const installHostCss = () => {
      if (!shadow) return;
      try {
        const current = shadow.adoptedStyleSheets;
        if (protectionSheet && current?.includes?.(protectionSheet)) return;
        const view = host.ownerDocument?.defaultView || window;
        const Sheet = view.CSSStyleSheet || (typeof CSSStyleSheet === 'function' ? CSSStyleSheet : null);
        if (typeof Sheet === 'function' && Sheet.prototype?.replaceSync && current && typeof current[Symbol.iterator] === 'function') {
          if (!protectionSheet) {
            protectionSheet = new Sheet();
            protectionSheet.replaceSync(hostCss);
          }
          if (![...current].includes(protectionSheet)) shadow.adoptedStyleSheets = [...current, protectionSheet];
          return;
        }
      } catch {}
      if (!protectionStyle) {
        protectionStyle = document.createElement('style');
        protectionStyle.dataset.expHostProtection = '1';
        protectionStyle.textContent = hostCss;
      }
      if (!protectionStyle.isConnected) {
        try { shadow.prepend(protectionStyle); } catch {}
      }
    };
    const ensure = () => {
      if (repairing) return;
      repairing = true;
      try {
        const root = document.documentElement;
        if (root && host.parentNode !== root) root.append(host);
        if (host.hidden) host.hidden = false;
        host.removeAttribute('hidden');
        host.removeAttribute('inert');
        if (host.getAttribute('aria-hidden') === 'true') host.removeAttribute('aria-hidden');
        installHostCss();
        if (typeof host.showPopover === 'function') {
          if (host.getAttribute('popover') !== 'manual') host.setAttribute('popover', 'manual');
          let open = false;
          try { open = host.matches(':popover-open'); } catch {}
          if (!open) { try { host.showPopover(); } catch {} }
        }
      } catch {}
      repairing = false;
    };
    ensure();
    const hostObserver = new MutationObserver(() => queueMicrotask(ensure));
    hostObserver.observe(host, { attributes: true, attributeFilter: ['hidden', 'inert', 'aria-hidden', 'popover'] });
    const rootObserver = new MutationObserver(() => {
      if (host.parentNode !== document.documentElement) queueMicrotask(ensure);
    });
    rootObserver.observe(document.documentElement, { childList: true });
    const timer = setInterval(ensure, 2000);
    const onToggle = () => queueMicrotask(ensure);
    host.addEventListener('toggle', onToggle);
    return () => {
      hostObserver.disconnect();
      rootObserver.disconnect();
      clearInterval(timer);
      host.removeEventListener('toggle', onToggle);
      if (protectionSheet && shadow?.adoptedStyleSheets) {
        try { shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets].filter((sheet) => sheet !== protectionSheet); } catch {}
      }
      try { protectionStyle?.remove(); } catch {}
    };
  }

function compareVersions(a, b) {
    const pa = String(a).split(".").map(Number), pb = String(b).split(".").map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) { const diff = (pa[i] || 0) - (pb[i] || 0); if (diff) return diff; }
    return 0;
  }
return Object.freeze({ PRIDE_RAINBOW, PRIDE_RAINBOW_VERTICAL, CRIMSON_THEME, UI_THEMES, SHARED_UI_THEMES, css, protectLauncherHost, compareVersions });
})();

/* Local diagnostic capture shared at build time by ExtraPotions products. */
const ExtraPotionsDiagnostics = (() => {
  const LIMIT = 100;
  const supportedProducts = ["dropper","shift","ward","prisma"];
  const protocol = 'exp-core-coordination-v1';
  const entries = [], hooks = [], registrations = new Map();
  const startedAt = new Date().toISOString();
  let omitted = 0, recording = false, active = true;
  const redact = value => String(value)
    .replace(/https?:\/\/[^\s"<>]+/gi, '[url]')
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[email]')
    .replace(/\b(Bearer|OAuth)\s+\S+/gi, '$1 [redacted]')
    .replace(/\b(token|password|secret|authorization|cookie)\s*[:=]\s*[^\s,;]+/gi, '$1=[redacted]')
    .replace(/\b\d{3}-\d{7}-\d{7}\b/g, '[order-id]')
    .replace(/\b[A-Za-z0-9_-]{40,}\b/g, '[opaque-id]')
    .slice(0, 2000);
  function clean(value, depth = 0, seen = new WeakSet()) {
    if (depth > 8) return '[depth limit]';
    if (typeof value === 'string') return redact(value);
    if (typeof value === 'bigint') return String(value);
    if (typeof value === 'function' || typeof value === 'symbol') return undefined;
    if (!value || typeof value !== 'object') return value;
    if (value instanceof Node || value === window) return undefined;
    if (seen.has(value)) return '[circular]';
    seen.add(value);
    try {
      if (value instanceof Error) return { name: redact(value.name), message: redact(value.message), stack: redact(value.stack || '') };
      if (Array.isArray(value)) return value.slice(0, 100).map(item => clean(item, depth + 1, seen));
      const result = {};
      for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value)).slice(0, 150)) {
        if (/token|cookie|authorization|password|secret|pageText|innerHTML|outerHTML|formValue|matchText|__proto__|constructor|prototype/i.test(key)) continue;
        if (!('value' in descriptor)) continue;
        const item = clean(descriptor.value, depth + 1, seen);
        if (item !== undefined) result[key] = item;
      }
      return result;
    } catch { return '[unavailable]'; } finally { seen.delete(value); }
  }
  function record(level, kind, values) {
    if (recording || !active) return;
    recording = true;
    try {
      entries.push({ at: new Date().toISOString(), level, kind, values: clean(values.slice(0, 10)) });
      if (entries.length > LIMIT) { entries.shift(); omitted += 1; }
    } catch {} finally { recording = false; }
  }
  for (const level of ['debug', 'log', 'info', 'warn', 'error']) {
    try {
      const original = console[level];
      if (typeof original !== 'function') continue;
      const wrapped = function(...args) { record(level, 'console', args); return Reflect.apply(original, this, args); };
      console[level] = wrapped;
      if (console[level] === wrapped) hooks.push({ level, original, wrapped });
    } catch {}
  }
  function resourceErrorDetails(target) {
    const element = target?.tagName || 'unknown';
    const root = target?.getRootNode?.();
    const host = root?.host || null;
    const productId = host?.dataset?.productId || host?.dataset?.expDiagnosticsProduct || null;
    const owned = Boolean(
      productId ||
      host?.dataset?.expOwned === '1' ||
      target?.dataset?.expOwned === '1'
    );
    let assetHost = null;
    try {
      const raw = target?.currentSrc || target?.src || target?.href || '';
      assetHost = raw ? new URL(raw, location.href).hostname : null;
    } catch {}
    return {
      element,
      owner: owned ? (productId || 'extrapotions') : 'page',
      assetHost,
    };
  }
  const onError = event => record('error', event.target === window ? 'runtime-error' : 'resource-error',
    event.target === window
      ? [event.error || event.message, { line: event.lineno, column: event.colno }]
      : [resourceErrorDetails(event.target)]);
  const onRejection = event => record('error', 'unhandled-rejection', [event.reason]);
  addEventListener('error', onError, true);
  addEventListener('unhandledrejection', onRejection);

  function registerProduct(id, version, host) {
    id = String(id).toLowerCase();
    if (!supportedProducts.includes(id)) return null;
    let marker = registrations.get(id);
    if (!marker) {
      marker = document.createElement('meta');
      marker.dataset.expOwned = '1';
      marker.dataset.expDiagnosticsProduct = id;
      marker.dataset.expProductVersion = String(version || 'unknown').slice(0, 40);
      marker.dataset.expCoordinationProtocol = protocol;
      marker.dataset.expDiagnosticsInstance = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
      registrations.set(id, marker);
    }
    if (!marker.isConnected) (document.head || document.documentElement)?.append(marker);
    if (host) host.dataset.expDiagnosticsInstance = marker.dataset.expDiagnosticsInstance;
    return marker;
  }
  addEventListener('DOMContentLoaded', () => { for (const marker of registrations.values()) if (!marker.isConnected) (document.head || document.documentElement)?.append(marker); }, { once: true });
  function compatibility() {
    const markers = [...document.querySelectorAll('meta[data-exp-diagnostics-product]')];
    const hosts = [...document.querySelectorAll('[data-exp-product-launcher="1"][data-product-id]')];
    const conflicts = [];
    const products = supportedProducts.map(id => {
      const records = markers.filter(n => n.dataset.expDiagnosticsProduct === id);
      const launchers = hosts.filter(n => n.dataset.productId === id);
      const versions = [...new Set(records.map(n => redact(n.dataset.expProductVersion || 'unknown')))];
      const protocols = [...new Set(records.map(n => redact(n.dataset.expCoordinationProtocol || 'unknown')))];
      if (records.length > 1 || launchers.length > 1) conflicts.push({ type: 'duplicate-product', products: [id], instances: Math.max(records.length, launchers.length) });
      if (protocols.some(p => p !== protocol && p !== 'unknown')) conflicts.push({ type: 'protocol-mismatch', products: [id], protocols });
      return { id, status: records.length || launchers.length ? 'observed' : 'not-observed', versions, protocols, instances: Math.max(records.length, launchers.length), launchers: launchers.length };
    });
    const boxes = hosts.map(host => {
      // An inaccessible shadow or unknown box is not evidence of a collision.
      const launcher = host.shadowRoot?.querySelector('[data-exp-part="launcher"]');
      if (!launcher || !launcher.getClientRects().length || getComputedStyle(launcher).visibility === 'hidden') return null;
      return { id: host.dataset.productId, box: launcher.getBoundingClientRect() };
    }).filter(x => x && supportedProducts.includes(x.id));
    for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) {
      const x = boxes[a], y = boxes[b];
      if (Math.min(x.box.right, y.box.right) - Math.max(x.box.left, y.box.left) > 2 && Math.min(x.box.bottom, y.box.bottom) - Math.max(x.box.top, y.box.top) > 2)
        conflicts.push({ type: 'launcher-overlap', products: [x.id, y.id] });
    }
    return { scope: 'current-page', installationInventory: 'unavailable', products, conflicts,
      status: conflicts.length ? 'conflicts-detected' : 'no-conflicts-observed',
      limitations: ['Disabled products and products outside their match rules cannot be enumerated.', 'Only reported registrations, protocol mismatches, duplicate instances and observable launcher overlap are checked.'] };
  }
  function createReport(product, details = {}, core = {}) {
    const { host, shadow: suppliedShadow, ...rest } = details;
    const shadow = suppliedShadow || host?.shadowRoot;
    const id = String(product || 'ExtraPotions').toLowerCase();
    const registration = registerProduct(id, details.product?.version || details.version, host);
    const data = clean(rest);
    const count = selector => document.querySelectorAll(selector).length;
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    const byType = {};
    for (const entry of resources) {
      const summary = byType[entry.initiatorType || 'other'] ||= { count: 0, durationMs: 0, transferBytes: 0 };
      summary.count++; summary.durationMs += Math.round(entry.duration); summary.transferBytes += entry.transferSize || 0;
    }
    const page = { origin: location.origin, protocol: location.protocol, readyState: document.readyState, contentType: document.contentType, characterSet: document.characterSet, compatibilityMode: document.compatMode, language: document.documentElement?.lang || null, direction: document.documentElement?.dir || 'auto',
      structure: { elements: count('*'), headings: count('h1,h2,h3,h4,h5,h6'), links: count('a[href]'), forms: count('form'), inputs: count('input,select,textarea'), buttons: count('button,[role="button"]'), images: count('img'), videos: count('video'), audio: count('audio'), frames: count('iframe'), scripts: count('script'), stylesheets: document.styleSheets.length },
      layout: { documentWidth: document.documentElement?.scrollWidth || 0, documentHeight: document.documentElement?.scrollHeight || 0, scrollX, scrollY, horizontalOverflow: (document.documentElement?.scrollWidth || 0) > innerWidth },
      preferences: { reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, darkColorScheme: matchMedia('(prefers-color-scheme: dark)').matches, forcedColors: matchMedia('(forced-colors: active)').matches },
      performance: { navigation: navigation ? { type: navigation.type, durationMs: Math.round(navigation.duration), responseMs: Math.round(navigation.responseEnd), domInteractiveMs: Math.round(navigation.domInteractive), domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd), loadMs: Math.round(navigation.loadEventEnd), redirectCount: navigation.redirectCount } : null, resources: { count: resources.length, byType }, paint: performance.getEntriesByType('paint').map(e => ({ name: e.name, startMs: Math.round(e.startTime) })) },
      privacy: { pageText: 'excluded', formValues: 'excluded', urlPathsAndQueries: 'excluded', resourceUrls: 'excluded', cookiesAndStorage: 'excluded; sanitized plugin state supplied separately' } };
    const environment = { hostname: location.hostname, topLevelContext: window.top === window.self, visibility: document.visibilityState, online: navigator.onLine, language: navigator.language, userAgent: navigator.userAgent, viewport: { width: innerWidth, height: innerHeight, pixelRatio: devicePixelRatio } };
    const rect = n => { const b = n.getBoundingClientRect(); return { width: b.width, height: b.height, x: b.x, y: b.y, visible: !!n.getClientRects().length && getComputedStyle(n).visibility !== 'hidden' }; };
    const first = selector => shadow?.querySelector(selector) || null;
    const visibleFirst = selector => [...(shadow?.querySelectorAll(selector) || [])].find(n => !n.hidden && n.getClientRects().length) || first(selector);
    const progressCard = first('[data-exp-part="progress-card"]');
    const launcher = first('[data-exp-part="launcher"]');
    const launcherRow = first('[data-exp-part="launcher-row"]');
    const menu = first('[data-exp-part="dock"]');
    const notice = visibleFirst('[data-exp-update-notice],.update-notice,.changelog');
    const uiGeometry = {
      progressCardRect: progressCard ? rect(progressCard) : null,
      launcherRect: launcher ? rect(launcher) : null,
      launcherRowRect: launcherRow ? rect(launcherRow) : null,
      menuRect: menu ? rect(menu) : null,
      noticeRect: notice ? rect(notice) : null,
    };
    const ui = {
      mounted: !!host?.isConnected,
      menuWidthMode: host?.dataset.menuWidth || null,
      uiGeometry,
      progressPanelWidth: progressCard ? Math.round(progressCard.getBoundingClientRect().width) : null,
      launcherRowWidth: launcherRow ? Math.round(launcherRow.getBoundingClientRect().width) : null,
      menuWidth: menu ? Math.round(menu.getBoundingClientRect().width) : null,
      noticeWidth: notice && !notice.hidden ? Math.round(notice.getBoundingClientRect().width) : null,
      surfaces: [...(shadow?.querySelectorAll('[data-exp-part="dock"]') || [])].map(rect),
      categories: [...(shadow?.querySelectorAll('.route,.nav-item,.fl-tool-header') || [])].map(n => ({ name: redact(n.textContent.trim()), expanded: n.getAttribute('aria-expanded') })),
      swatches: [...(shadow?.querySelectorAll('.exp-theme-swatch') || [])].map(n => ({ name: n.getAttribute('aria-label'), selected: n.getAttribute('aria-pressed'), ...rect(n) })),
    };
    let manager = null;
    try { if (typeof GM_info === 'object') manager = { name: GM_info.scriptHandler || null, version: GM_info.version || null, injectInto: GM_info.injectInto || null }; } catch {}
    return { ...data, report: `${product} Diagnostics`, schemaVersion: 3, generatedAt: new Date().toISOString(), page,
      technical: { environment, manager, core: clean(core), ui, capabilities: { mutationObserver: typeof MutationObserver === 'function', constructedStylesheets: typeof CSSStyleSheet === 'function' && 'replaceSync' in CSSStyleSheet.prototype, clipboard: !!navigator.clipboard, trustedTypes: !!globalThis.trustedTypes } },
      console: { startedAt, scope: 'accessible-userscript-realm-and-window-events', limit: LIMIT, omitted, hooks: hooks.map(h => ({ level: h.level, installed: console[h.level] === h.wrapped })), entries: clean(entries), limitations: ['No DevTools history, browser-internal logs, or inaccessible isolated-world console messages.', 'Messages are redacted and bounded; attribution to another script is not inferred.'] },
      plugin: { id, version: data.product?.version || data.version || registration?.dataset.expProductVersion || null, state: data, compatibility: compatibility() },
      environment, ui, core: data.core || clean(core) };
  }
  function dispose() {
    active = false;
    for (const {level, original, wrapped} of hooks) if (console[level] === wrapped) console[level] = original;
    removeEventListener('error', onError, true); removeEventListener('unhandledrejection', onRejection);
    for (const marker of registrations.values()) marker.remove();
  }
  // Core owns the shared diagnostics interaction contract: Show/Hide first, Copy second,
  // transient Diagnostics Copied / Copy Failed feedback, and fresh reports per action.
  function bindControls({ show, copy, output, getReport, notify = () => {}, onShow = () => {}, onCopy = () => {} }) {
    let timer, generation = 0;
    output.hidden = true; output.setAttribute('role', 'region');
    output.setAttribute('aria-label', 'Page, technical, console, and plugin diagnostics'); output.tabIndex = 0;
    show.setAttribute('aria-expanded', 'false');
    const showClick = async () => {
      const opening = output.hidden, ticket = ++generation;
      output.hidden = !opening; output.classList.toggle('open', opening);
      show.textContent = opening ? 'Hide Diagnostics' : 'Show Diagnostics';
      show.setAttribute('aria-expanded', String(opening)); show.classList.toggle('last-opened', opening);
      if (opening) {
        try { const report = await getReport(); if (ticket === generation) output.textContent = JSON.stringify(report, null, 2); }
        catch { if (ticket === generation) output.textContent = 'Diagnostics unavailable.'; notify('Could not generate diagnostics.'); }
      }
      onShow(opening);
    };
    const copyClick = async () => {
      copy.disabled = true; clearTimeout(timer);
      try {
        await navigator.clipboard.writeText(JSON.stringify(await getReport(), null, 2));
        copy.textContent = 'Diagnostics Copied'; onCopy();
      } catch { copy.textContent = 'Copy Failed'; notify('Could not copy diagnostics. Use Show Diagnostics.'); }
      finally { copy.disabled = false; timer = setTimeout(() => { copy.textContent = 'Copy Diagnostics'; }, 1600); }
    };
    show.addEventListener('click', showClick); copy.addEventListener('click', copyClick);
    return () => { ++generation; clearTimeout(timer); show.removeEventListener('click', showClick); copy.removeEventListener('click', copyClick); };
  }
  function createControls(getReport, notify) {
    const wrapper = document.createElement('div'); wrapper.className = 'diagnostics-controls';
    const actions = document.createElement('div'); actions.className = 'action-pair';
    const show = document.createElement('button'), copy = document.createElement('button'), output = document.createElement('pre');
    for (const button of [show, copy]) { button.type = 'button'; button.className = 'life-btn action'; }
    show.textContent = 'Show Diagnostics'; copy.textContent = 'Copy Diagnostics'; output.className = 'diag';
    bindControls({ show, copy, output, getReport, notify });
    actions.append(show, copy); wrapper.append(actions, output); return wrapper;
  }
  return Object.freeze({ createReport, registerProduct, compatibility, bindControls, createControls, dispose });
})();

/* Canonical ExtraPotions shared lifecycle runtime. */
function createProductLifecycle(shared) {
  const VERSION = shared.version;
  const PROTOCOL = 'exp-core-coordination-v1';
  const CAPABILITIES = new Set(['lifecycle', 'settings', 'diagnostics', 'dom-scheduler', 'navigation', 'launcher', 'ui']);
  const products = new Map();
  const cleanups = new Set();
  const errors = [];
  const metrics = { batches: 0, roots: 0, startedAt: Date.now() };
  let coordinator;
  const navigationSubscribers = new Set();
  let stopNavigationHooks;

  function compareVersions(left, right) {
    const a = String(left).split(/[.-]/).slice(0, 3).map((part) => Number(part) || 0);
    const b = String(right).split(/[.-]/).slice(0, 3).map((part) => Number(part) || 0);
    for (let index = 0; index < 3; index += 1) if (a[index] !== b[index]) return a[index] > b[index] ? 1 : -1;
    return 0;
  }

  function negotiate(peerVersion, peerProtocol = PROTOCOL) {
    if (peerProtocol !== PROTOCOL || !/^\d+\.\d+\.\d+/.test(peerVersion || '')) return { compatible: false, selection: 'isolated', reason: 'PROTOCOL_INCOMPATIBLE' };
    const comparison = compareVersions(VERSION, peerVersion);
    return { compatible: true, selection: comparison < 0 ? 'peer-newer' : comparison > 0 ? 'local-newer' : 'equal', reason: 'COMPATIBLE' };
  }

  const safeError = (error, source = 'core') => {
    const message = String(error && error.message || error || 'Unknown error').replace(/https?:\/\/\S+/g, '[url]').slice(0, 180);
    errors.push({ source, code: error && error.code || 'UNEXPECTED', message, at: Date.now() });
    if (errors.length > 12) errors.shift();
  };

  function ensureCoordinator() {
    if (!document.documentElement) return null;
    coordinator = document.querySelector('[data-exp-core-coordinator="1"]');
    if (!coordinator) {
      coordinator = document.createElement('meta');
      coordinator.dataset.expCoreCoordinator = '1';
      coordinator.dataset.protocol = PROTOCOL;
      coordinator.dataset.protocolVersion = '1';
      document.documentElement.append(coordinator);
    }
    const selected = coordinator.dataset.activeCoreVersion;
    if (!selected || compareVersions(VERSION, selected) > 0) coordinator.dataset.activeCoreVersion = VERSION;
    return coordinator;
  }

  function announce(type, detail = {}) {
    const node = ensureCoordinator();
    if (!node) return;
    const payload = { protocol: PROTOCOL, protocolVersion: 1, coreVersion: VERSION, type, ...detail };
    document.dispatchEvent(new CustomEvent('exp-core:coordination', { detail: payload }));
  }

  function publishProduct(manifest, state) {
    const node = ensureCoordinator();
    if (!node) return;
    const key = `product${manifest.id.replace(/[^a-z0-9]/gi, '')}`;
    node.dataset[key] = JSON.stringify({ id: manifest.id, version: manifest.version, state, capabilities: manifest.capabilities });
    announce('product-state', { productId: manifest.id, productVersion: manifest.version, state });
  }

  function validateManifest(manifest) {
    if (!manifest || !/^[a-z][a-z0-9-]+$/.test(manifest.id || '')) throw Object.assign(new Error('Invalid product ID'), { code: 'MANIFEST_ID' });
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version || '')) throw Object.assign(new Error('Invalid product version'), { code: 'MANIFEST_VERSION' });
    if (!Array.isArray(manifest.capabilities)) throw Object.assign(new Error('Capabilities must be an array'), { code: 'MANIFEST_CAPABILITIES' });
    const missing = manifest.capabilities.filter((item) => !CAPABILITIES.has(item));
    if (missing.length) throw Object.assign(new Error(`Missing Core capability: ${missing.join(', ')}`), { code: 'CAPABILITY_MISSING' });
  }

  function register(manifest, hooks) {
    validateManifest(manifest);
    if (products.has(manifest.id)) return products.get(manifest.id).public;
    const record = { manifest: Object.freeze({ ...manifest }), hooks, state: 'registered', queue: Promise.resolve() };
    const transition = (allowed, next, action) => {
      record.queue = record.queue.catch(() => {}).then(async () => {
        if (!allowed.includes(record.state)) return;
        try {
          await action?.();
          record.state = next;
          publishProduct(record.manifest, next);
        } catch (error) {
          record.state = 'failed';
          safeError(error, manifest.id);
          publishProduct(record.manifest, 'failed');
          throw error;
        }
      });
      return record.queue;
    };
    record.public = Object.freeze({
      manifest: record.manifest,
      get state() { return record.state; },
      initialize: () => transition(['registered', 'failed'], 'initialized', hooks.initialize),
      enable: () => transition(['initialized', 'disabled'], 'enabled', hooks.enable),
      disable: () => transition(['enabled'], 'disabled', hooks.disable),
      cleanup: () => transition(['registered', 'initialized', 'enabled', 'disabled', 'failed'], 'cleaned', hooks.cleanup)
    });
    products.set(manifest.id, record);
    publishProduct(record.manifest, 'registered');
    return record.public;
  }

  function createScheduler(callback, options = {}) {
    let observer;
    let sharedObserverCleanup;
    let frame = 0;
    let active = false;
    const roots = new Set();
    const flush = () => {
      frame = 0;
      if (!active || !roots.size) return;
      const batch = [...roots];
      roots.clear();
      metrics.batches += 1;
      metrics.roots += batch.length;
      try { callback(batch); } catch (error) { safeError(error, options.source || 'scheduler'); }
    };
    const queueRoot = (root) => {
      if (!active || !root || root.closest?.('[data-exp-owned="1"]')) return false;
      const target = root.nodeType === Node.TEXT_NODE ? root.parentElement : root;
      if (!target) return false;
      roots.add(target);
      return true;
    };
    const schedule = (root) => {
      if (!queueRoot(root)) return;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const startDedicatedObserver = () => {
      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          const target = mutation.target?.nodeType === Node.TEXT_NODE ? mutation.target.parentElement : mutation.target;
          if (!target) continue;
          if (target.closest?.('[data-exp-owned="1"]')) continue;
          if (mutation.type === 'childList') {
            const changed = [...mutation.addedNodes, ...mutation.removedNodes];
            if (changed.length && changed.every((node) => node.nodeType === 1 && (node.matches?.('[data-exp-owned="1"]') || node.closest?.('[data-exp-owned="1"]')))) continue;
          }
          schedule(target);
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: Boolean(options.attributes),
        characterData: Boolean(options.characterData),
        attributeFilter: options.attributeFilter
      });
    };
    return Object.freeze({
      start() {
        if (active) return;
        active = true;
        if (!options.attributes && typeof shared.observePageBatch === 'function') {
          const productId = options.source || 'scheduler';
          const phase = options.phase || shared.suiteContract?.(productId)?.presentationPhases?.[0] || 'observe';
          sharedObserverCleanup = shared.observePageBatch((batch, batchRoots, details) => {
            for (let index = 0; index < batchRoots.length; index += 1) {
              const types = Array.isArray(details?.[index]?.types) ? details[index].types : [];
              if (!options.characterData && types.length && types.every(type => type === 'characterData')) continue;
              queueRoot(batchRoots[index]);
            }
            if (roots.size) {
              if (frame) { cancelAnimationFrame(frame); frame = 0; }
              flush();
            }
          }, { productId, phase });
        } else if (!options.attributes && typeof shared.observePage === 'function') {
          sharedObserverCleanup = shared.observePage((batch, root) => {
            const types = Array.isArray(batch?.types) ? batch.types : [];
            if (!options.characterData && types.length && types.every(type => type === 'characterData')) return;
            schedule(root);
          }, { productId: options.source || 'scheduler' });
        } else {
          startDedicatedObserver();
        }
        schedule(document.documentElement);
      },
      stop() {
        active = false;
        sharedObserverCleanup?.();
        sharedObserverCleanup = null;
        observer?.disconnect();
        observer = null;
        roots.clear();
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      },
      schedule,
      flush
    });
  }

  function onNavigation(callback) {
    if (typeof callback !== 'function') throw new TypeError('Navigation callback must be a function');
    if (typeof shared.observeNavigation === 'function') {
      let disposed = false;
      const stop = shared.observeNavigation(event => callback({
        href: event.href,
        kind: event.kind,
        epoch: event.epoch,
      }), { owner: 'lifecycle' });
      const cleanup = () => {
        if (disposed) return;
        disposed = true;
        stop();
        cleanups.delete(cleanup);
      };
      cleanups.add(cleanup);
      return cleanup;
    }
    let previous=location.href;
    const subscriber=({href})=>{if(href!==previous){previous=href;callback({href});}};
    if (!stopNavigationHooks) {
      const originals={},wrappers={};
      const check=()=>{const href=location.href;for(const notify of [...navigationSubscribers])notify({href});};
      for(const name of ['pushState','replaceState']){const original=history[name];originals[name]=original;const wrapped=function(...args){const result=Reflect.apply(original,this,args);check();return result;};wrappers[name]=wrapped;history[name]=wrapped;}
      addEventListener('popstate',check);addEventListener('hashchange',check);globalThis.navigation?.addEventListener('currententrychange',check);
      stopNavigationHooks=()=>{for(const name of Object.keys(wrappers))if(history[name]===wrappers[name])history[name]=originals[name];removeEventListener('popstate',check);removeEventListener('hashchange',check);globalThis.navigation?.removeEventListener('currententrychange',check);stopNavigationHooks=null;};
    }
    navigationSubscribers.add(subscriber);
    let disposed=false;
    const cleanup=()=>{if(disposed)return;disposed=true;navigationSubscribers.delete(subscriber);cleanups.delete(cleanup);if(!navigationSubscribers.size)stopNavigationHooks?.();};
    cleanups.add(cleanup);return cleanup;
  }


  function protectLauncherHost(host) { return shared.reference.protectLauncherHost(host); }

  function registerLauncher(host, options) { const cleanup = shared.registerLauncher(host, options); cleanups.add(cleanup); return cleanup; }

  function pageView() {
    try { if (typeof unsafeWindow !== 'undefined' && unsafeWindow?.document) return unsafeWindow; } catch {}
    return window;
  }

  function isShadowRoot(node) {
    return Boolean(node && node.nodeType === 11 && node.host);
  }

  function appendShadowStyle(root, css, data) {
    const node = document.createElement('style');
    try { node.textContent = css; } catch (error) { safeError(error, 'core.style'); }
    node.dataset.expOwned = '1';
    for (const [key, value] of Object.entries(data || {})) node.dataset[key] = String(value);
    root.append(node);
    return node;
  }

  function paintToken() {
    return `expink${Math.random().toString(36).slice(2, 10)}`;
  }

  function withPaintProbe(css, token) {
    return `${css}\n[data-${token}]{color:rgb(1, 2, 3)!important}`;
  }

  function isConnectedNode(node) {
    try { return Boolean(node && (node.isConnected || node.host?.isConnected)); } catch { return false; }
  }

  function sheetHasRules(sheet) {
    try { return sheet.cssRules.length > 0; } catch { return null; }
  }

  function sawPaint(token, parent) {
    if (!parent || !isConnectedNode(parent)) return false;
    const probe = document.createElement('span');
    probe.setAttribute(`data-${token}`, '');
    parent.append(probe);
    let painted = false;
    try { painted = getComputedStyle(probe).color === 'rgb(1, 2, 3)'; } catch {}
    try { probe.remove(); } catch { probe.parentNode?.removeChild(probe); }
    return painted;
  }

  function writeSheet(sheet, text, view) {
    const source = String(text || '');
    try { sheet.replaceSync(source); return; } catch {}
    view.Function('sheet', 'css', 'sheet.replaceSync(css)')(sheet, source);
  }

  function setAdopted(host, sheets) {
    try { host.adoptedStyleSheets = sheets; return; } catch {}
    const view = pageView();
    const proto = isShadowRoot(host) ? (view.ShadowRoot || ShadowRoot).prototype : (view.Document || Document).prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'adoptedStyleSheets');
    if (!desc?.set) throw new Error('adoptedStyleSheets unavailable');
    desc.set.call(host, sheets);
  }

  function adoptConstructable(host, css, shadow) {
    const view = pageView();
    const Ctor = view.CSSStyleSheet || (typeof CSSStyleSheet === 'function' ? CSSStyleSheet : null);
    if (typeof Ctor !== 'function' || !Ctor.prototype.replaceSync) return null;
    const current = host.adoptedStyleSheets;
    if (!current || typeof current[Symbol.iterator] !== 'function') return null;
    const sheet = new Ctor();
    const token = paintToken();
    writeSheet(sheet, withPaintProbe(css, token), view);
    const before = current.length;
    setAdopted(host, [...current, sheet]);
    const sample = shadow || host.documentElement || host;
    if (host.adoptedStyleSheets.length !== before + 1) {
      try { setAdopted(host, [...host.adoptedStyleSheets].filter((item) => item !== sheet)); } catch {}
      throw new Error('adoptedStyleSheets ignored');
    }
    const painted = isConnectedNode(sample) ? sawPaint(token, sample) : sheetHasRules(sheet) !== false;
    if (!painted) {
      try { setAdopted(host, [...host.adoptedStyleSheets].filter((item) => item !== sheet)); } catch {}
      throw new Error('adoptedStyleSheets did not paint');
    }
    writeSheet(sheet, css, view);
    return {
      sheet,
      write: (text) => writeSheet(sheet, text, view),
      detach() {
        try { setAdopted(host, [...host.adoptedStyleSheets].filter((item) => item !== sheet)); } catch {}
      }
    };
  }

  function injectShadowStyle(root, css, data) {
    const mark = (node) => {
      node.dataset.expOwned = '1';
      for (const [key, value] of Object.entries(data || {})) node.dataset[key] = String(value);
      return node;
    };
    const fail = (error) => safeError(Object.assign(error || new Error('Style injection failed'), { code: 'STYLE_INJECTION' }), 'core.style');
    // Adopted sheets stay inside the shadow and still apply when the page CSP
    // blocks <style>. GM_addElement / GM_addStyle are not used here: managers
    // attach those to the document and leak header/nav/button/* onto the site.
    try {
      const adopted = adoptConstructable(root, css, root);
      if (adopted) {
        const node = document.createElement('style');
        let current = css;
        Object.defineProperty(node, 'textContent', {
          configurable: true,
          enumerable: true,
          get() { return current; },
          set(value) {
            current = String(value || '');
            try { adopted.write(current); } catch (error) { fail(error); }
          }
        });
        node.remove = () => {
          try { adopted.detach(); } catch {}
          if (node.parentNode) node.parentNode.removeChild(node);
        };
        try { root.append(node); } catch {}
        return mark(node);
      }
    } catch (error) { fail(error); }
    return appendShadowStyle(root, css, data);
  }

  function injectStyle(root, cssText, data = {}) {
    const css = String(cssText || '');
    if (isShadowRoot(root)) return injectShadowStyle(root, css, data);
    const isShadow = false;
    const view = pageView();
    const doc = view.document || document;
    const parent = isShadow ? root : (doc.documentElement || doc.head || doc.body);
    const host = isShadow ? root : doc;
    const sample = isShadow ? root : (doc.body || doc.documentElement);
    const mark = (node) => {
      node.dataset.expOwned = '1';
      for (const [key, value] of Object.entries(data || {})) node.dataset[key] = String(value);
      return node;
    };
    const fail = (error) => safeError(Object.assign(error || new Error('Style injection failed'), { code: 'STYLE_INJECTION' }), 'core.style');
    const handle = (write, detach) => {
      const node = document.createElement('style');
      let current = css;
      Object.defineProperty(node, 'textContent', {
        configurable: true,
        enumerable: true,
        get() { return current; },
        set(value) {
          current = String(value || '');
          try { write(current); } catch (error) { fail(error); }
        }
      });
      node.remove = () => {
        try { detach(); } catch {}
        if (node.parentNode) node.parentNode.removeChild(node);
      };
      parent.append(node);
      return mark(node);
    };
    try {
      if (typeof GM_addElement === 'function') {
        const token = paintToken();
        let live = GM_addElement(parent, 'style', { textContent: withPaintProbe(css, token) });
        if (live && sawPaint(token, sample)) {
          try { live.textContent = css; } catch {}
          return handle(
            (text) => {
              try { live.textContent = text; } catch {
                const next = GM_addElement(parent, 'style', { textContent: text });
                try { live.remove(); } catch {}
                live = next;
              }
            },
            () => { try { live.remove(); } catch {} }
          );
        }
        try { live?.remove(); } catch {}
      }
    } catch (error) { fail(error); }
    try {
      if (!isShadow && typeof GM_addStyle === 'function') {
        const token = paintToken();
        let live = GM_addStyle(withPaintProbe(css, token));
        if (live && sawPaint(token, sample)) {
          try { live.textContent = css; } catch {}
          return handle(
            (text) => {
              try { live.textContent = text; } catch { live = GM_addStyle(text); }
            },
            () => { try { live.remove(); } catch {} }
          );
        }
        try { live?.remove(); } catch {}
      }
    } catch (error) { fail(error); }
    try {
      const adopted = adoptConstructable(host, css, sample);
      if (adopted) return handle((text) => adopted.write(text), () => adopted.detach());
    } catch (error) { fail(error); }
    const node = document.createElement('style');
    try { node.textContent = css; } catch (error) { fail(error); }
    parent.append(node);
    return mark(node);
  }

  function diagnosticSnapshot() {
    return {
      core: { version: VERSION, protocol: PROTOCOL, capabilities: [...CAPABILITIES] },
      products: [...products.values()].map(({ manifest, state }) => ({ id: manifest.id, version: manifest.version, state })),
      metrics: { ...metrics, uptimeMs: Date.now() - metrics.startedAt },
      errors: errors.map(({ source, code, message }) => ({ source, code, message }))
    };
  }

  function focusMenuSurface(surface) { if (!(surface instanceof HTMLElement)) return false; if (!surface.hasAttribute('tabindex')) surface.setAttribute('tabindex', '-1'); surface.style.outline='none'; surface.focus({ preventScroll: true }); return true; }

  addEventListener('pagehide', () => { for (const cleanup of cleanups) { try { cleanup(); } catch {} } }, { once: true });
  return Object.freeze({
    VERSION, PROTOCOL, register, createScheduler, onNavigation, registerLauncher, announce, negotiate, safeError,
    diagnosticSnapshot, diagnostics: diagnosticSnapshot, focusMenuSurface, injectStyle,
    registerFloatingNotice: shared.registerFloatingNotice,
    layoutFloatingNotices: shared.layoutFloatingNotices,
    claimNotice: shared.claimNotice,
    consumeVersionChange: shared.consumeVersionChange,
  });
}

// Shared, local-only compatibility controls.
const ExtraPotionsTools = (() => {
  const PRODUCT_ROOT_IDS = {"dropper":"tdh-root","shift":"exp-shift-root","ward":"exp-ward-root","prisma":"exp-prisma-root"};
  function placeDonationPanel(panel, trigger){
    trigger.closest('.menu-head,header')?.after(panel);
    panel.style.cssText='position:static!important;width:100%!important;max-width:100%!important;margin:7px 0;box-shadow:none';
  }
  function createBitcoinDonation(){
    const address='bc1qg4xq63mwu63qc5dnqugk3qtxvulv5p3frjayna8ey8tu8ey4wpxsg92hv3';
    const details=document.createElement('details');details.className='exp-bitcoin-donation';details.style.cssText='margin-top:7px;min-width:0';
    const summary=document.createElement('summary');summary.textContent='₿ Bitcoin';summary.style.cssText='cursor:pointer;font-weight:700;padding:6px;border:1px solid var(--theme-line);border-radius:7px';
    const code=document.createElement('code');code.textContent=address;code.setAttribute('aria-label','Bitcoin donation address');code.style.cssText='display:block;overflow-wrap:anywhere;word-break:break-all;user-select:all;margin:7px 0;font-size:11px;line-height:1.4';
    const status=document.createElement('p');status.setAttribute('role','status');status.style.cssText='margin:5px 0 0;font-size:10px';
    const copy=button('Copy Bitcoin address',async()=>{try{await navigator.clipboard.writeText(address);status.textContent='Bitcoin address copied.';}catch{status.textContent='Select and copy the address above.';}});copy.style.cssText='width:100%;min-width:0;white-space:normal;border-radius:7px';
    const wallet=document.createElement('a');wallet.href='bitcoin:'+address;wallet.textContent='Open Bitcoin wallet';
    details.append(summary,code,copy,wallet,status);return details;
  }
  function compatibilitySnapshot(){
    const rows=[];const warnings=[];const versions=new Set();
    for(const [id,rootId] of Object.entries(PRODUCT_ROOT_IDS)){
      const markers=[...document.querySelectorAll('[data-exp-diagnostics-product]')].filter(n=>n.dataset.expDiagnosticsProduct===id);
      if(!markers.length)continue;
      const productVersions=[...new Set(markers.map(n=>n.dataset.expProductVersion||'unknown'))];
      const host=document.getElementById(rootId);
      const core=host?.dataset.coreVersion||null;if(core)versions.add(core);
      rows.push({id,versions:productVersions,core,instances:markers.length});
      if(markers.length>1)warnings.push(`More than one ${id.toUpperCase()} instance is active.`);
    }
    if(versions.size>1)warnings.push('Different core versions are active. Update the products and reload this page.');
    return {products:rows,warnings};
  }
  const button=(label,fn)=>{const b=document.createElement('button');b.type='button';b.className='life-btn action';b.textContent=label;b.addEventListener('click',fn);return b;};
  function card(title){const d=document.createElement('details');d.className='exp-tools-card';d.style.cssText='border:1px solid var(--theme-line,var(--line,#777));border-radius:7px;padding:7px;margin-top:8px';const s=document.createElement('summary');s.textContent=title;d.append(s);return d;}
  function createCompatibilityControls(){const d=card('Product compatibility'),out=document.createElement('div');out.setAttribute('aria-live','polite');function refresh(){out.replaceChildren();const value=compatibilitySnapshot();for(const p of value.products){const line=document.createElement('p');line.textContent=`${p.id.toUpperCase()} ${p.versions.join(', ')} · ${p.core?'core '+p.core:'native product UI'}`;out.append(line);}const status=document.createElement('p');status.textContent=value.warnings.join(' ')||'No mixed core versions or duplicate instances detected on this page.';out.append(status);const note=document.createElement('small');note.textContent='Only products running on this page are visible. This is not an online update check.';out.append(note);}d.addEventListener('toggle',()=>{if(d.open)refresh();});d.append(out,button('Refresh compatibility',refresh));return d;}
  return Object.freeze({placeDonationPanel,createBitcoinDonation,compatibilitySnapshot,createCompatibilityControls});
})();

// Shared ExtraPotions menu categories, submenu behavior, reordering, and visibility.
const ExpMenuArrangement = (() => {
  const CATEGORY_ORDER = Object.freeze(['main', 'appearance', 'advanced', 'system']);
  const CATEGORY_META = Object.freeze({
    main: Object.freeze({ id: 'main', label: 'Main', order: 0 }),
    appearance: Object.freeze({ id: 'appearance', label: 'Appearance', order: 1 }),
    advanced: Object.freeze({ id: 'advanced', label: 'Advanced', order: 2 }),
    system: Object.freeze({ id: 'system', label: 'System', order: 3 }),
  });
  const PRODUCT_SECTIONS = {"dropper":{"main":["drops","streams"],"appearance":["appearance"],"advanced":["advanced"],"system":["system"]},"shift":{"appearance":["appearance","readability"],"advanced":["effects","effects-integrations","profiles","profiles-sites"],"system":["system"]},"ward":{"main":["protection","amazon","tools"],"appearance":["appearance"],"advanced":["advanced","patterns","advanced-amazon"],"system":["system"]},"prisma":{"main":["page","highlights"],"appearance":["style","highlight-style","look","appearance"],"advanced":["tools","language","sites"],"system":["system"]}};
  const GENERIC_SECTIONS = Object.freeze({
    appearance: Object.freeze(['appearance', 'readability', 'style', 'highlight-style', 'look', 'theme', 'themes']),
    advanced: Object.freeze(['advanced', 'effects', 'integrations', 'profiles', 'sites', 'language', 'patterns', 'routing', 'playback']),
    system: Object.freeze(['system', 'settings', 'diagnostics', 'maintenance', 'recovery']),
  });
  const slug = value => String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const categoryList = Object.freeze(CATEGORY_ORDER.map(id => CATEGORY_META[id]));

  function categoryFor(productId, section = {}, index = 0) {
    const product = slug(productId);
    const key = slug(section.key || section.id || section.route);
    const label = slug(section.label || section.name || section.title);
    const tokens = new Set([key, label].filter(Boolean));
    const profile = PRODUCT_SECTIONS[product] || {};
    for (const category of CATEGORY_ORDER) {
      const aliases = profile[category] || [];
      if (aliases.some(alias => tokens.has(slug(alias)))) return category;
    }
    for (const category of ['system', 'appearance', 'advanced']) {
      if (GENERIC_SECTIONS[category].some(alias => tokens.has(slug(alias)))) return category;
    }
    if (index === 0) return 'main';
    return 'main';
  }

  function describe(productId, sections = []) {
    const groups = new Map(CATEGORY_ORDER.map(id => [id, {
      ...CATEGORY_META[id],
      sections: [],
    }]));
    sections.forEach((section, index) => {
      const category = categoryFor(productId, section, index);
      groups.get(category).sections.push(section);
    });
    return CATEGORY_ORDER.map(id => groups.get(id)).filter(group => group.sections.length);
  }

  function createDisclosure({ document, label, category = 'advanced', key = '', contents = [], className = 'exp-system-card' } = {}) {
    if (!document?.createElement) throw new Error('Menu disclosure requires a document');
    const details = document.createElement('details');
    details.className = className;
    details.dataset.expMenuSubmenu = '1';
    details.dataset.expMenuCategory = CATEGORY_META[category] ? category : 'advanced';
    if (key) details.dataset.expMenuKey = slug(key);
    details.open = false;
    // Core created this submenu in its canonical collapsed state. Mark it initialized
    // immediately so a later arrangement refresh cannot re-collapse a user-opened
    // disclosure during the same interaction.
    details.dataset.expMenuInitialized = '1';
    const summary = document.createElement('summary');
    summary.textContent = String(label || CATEGORY_META[category]?.label || 'Advanced');
    details.append(summary, ...contents);
    return details;
  }

  function collapseSubmenus(root) {
    if (!root?.querySelectorAll) return;
    for (const details of root.querySelectorAll('details[data-exp-menu-submenu]')) {
      if (details.dataset.expMenuInitialized === '1') continue;
      details.open = false;
      details.dataset.expMenuInitialized = '1';
    }
  }

  const css = `
    [data-exp-arrange-section]{position:relative}
    [data-exp-arrange-section]>.fl-tool-header{padding-left:38px!important}
    .exp-section-grip{position:absolute!important;left:4px!important;right:auto!important;top:4px!important;width:28px!important;height:26px!important;min-width:0!important;min-height:0!important;padding:0!important;border:1px solid var(--theme-line);border-radius:6px!important;background:var(--theme-bg);color:var(--theme-muted);touch-action:none;cursor:grab;z-index:1}
    .exp-section-grip[data-dragging=true]{cursor:grabbing}
    .exp-menu-editor{grid-column:1/-1;box-sizing:border-box;width:100%;min-width:0;padding:7px;border:1px solid var(--theme-line);border-radius:7px;background:var(--theme-bg);overflow:hidden}
    .exp-menu-editor>summary{cursor:pointer;font-weight:700}
    .exp-menu-category-list{display:grid;grid-template-columns:minmax(0,1fr);gap:7px;min-width:0;margin-top:7px}
    .exp-menu-category-group{min-width:0;padding:6px;border:1px solid var(--theme-line);border-radius:6px;background:var(--theme-panel)}
    .exp-menu-category-title{margin:0 0 4px;font-size:10px;font-weight:800;letter-spacing:.04em;color:var(--theme-muted);text-transform:uppercase}
    .exp-menu-editor .exp-menu-row{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0;margin-top:5px}
    .exp-menu-editor .exp-menu-row>span{min-width:0;overflow-wrap:anywhere}
    .exp-menu-editor button[role=switch]{flex:0 0 32px;width:32px;height:20px;padding:2px;border-radius:5px;border:1px solid var(--theme-line);background:var(--theme-panel)}
    .exp-menu-editor button[role=switch]::before{content:'';display:block;width:12px;height:12px;border-radius:3px;background:var(--theme-muted)}
    .exp-menu-editor button[aria-checked=true]{background:var(--theme-accent)}
    .exp-menu-editor button[aria-checked=true]::before{margin-left:auto;background:var(--theme-text)}
    .exp-menu-editor .exp-reset{width:100%;margin-top:7px;border-radius:6px}
    [data-exp-arrange-section][hidden]{display:none!important}
    [data-exp-menu-submenu]{box-sizing:border-box;min-width:0;max-width:100%;overflow-wrap:anywhere}
    [data-exp-menu-submenu]>summary{cursor:pointer}
    [data-exp-menu-width="narrow"] .exp-menu-editor{padding:6px}
    [data-exp-menu-width="narrow"] .exp-menu-category-group{padding:5px}
    [data-exp-menu-width="narrow"] .exp-menu-editor .exp-menu-row{gap:5px}
    [data-exp-menu-width="compact"] .exp-menu-category-list,
    [data-exp-menu-width="full"] .exp-menu-category-list{grid-template-columns:minmax(0,1fr)}
  `;

  function mount({ panel, id, onChange = () => {}, resetLaunchers = () => {} }) {
    const document = panel.ownerDocument, view = document.defaultView;
    collapseSubmenus(panel);
    const entries = [...panel.querySelectorAll(':scope .fl-tool-panel')].filter(section => section.parentElement === panel || section.parentElement?.closest('.fl-tool-panel') === null).map(section => {
      const header = section.querySelector(':scope>.fl-tool-header');
      const body = section.querySelector(':scope>.fl-tool-body');
      if (!header || !body) return null;
      const label = (header.querySelector('.fl-tool-title') || header).textContent.replace(/[▸▾›]/g, '').trim();
      const key = header.dataset.route || header.dataset.section || header.dataset.panel || body.id;
      return { section, header, body, label, key };
    }).filter(entry => entry?.key);
    if (entries.length < 2) return { update() { collapseSubmenus(panel); }, destroy() {} };
    const parent = entries[0].section.parentElement;
    if (entries.some(entry => entry.section.parentElement !== parent)) return { update() { collapseSubmenus(panel); }, destroy() {} };
    entries.forEach((entry, index) => {
      entry.category = categoryFor(id, entry, index);
      entry.section.dataset.expMenuCategory = entry.category;
    });
    const defaults = entries.map(entry => entry.key);
    const orderKey = `exp:v3:menu-order:${id}`, hiddenKey = `exp:v3:menu-hidden:${id}`;
    const read = key => { try { const value = JSON.parse(view.localStorage.getItem(key) || '[]'); return Array.isArray(value) ? [...new Set(value.filter(x => typeof x === 'string'))] : []; } catch { return []; } };
    const save = (key, value) => { try { view.localStorage.setItem(key, JSON.stringify(value)); } catch {} };
    let order = [...new Set([...read(orderKey), ...defaults])], hidden = read(hiddenKey), drag = null;
    const recovery = entries.find(entry => entry.category === 'system') || entries.find(entry => entry.label.toLowerCase() === 'system') || entries[0];
    const style = document.createElement('style'); style.textContent = css;
    const styleRoot = panel.getRootNode();
    (styleRoot instanceof view.ShadowRoot ? styleRoot : (document.head || document.documentElement)).append(style);
    const abort = new view.AbortController();
    const on = (node, type, handler, options = {}) => node.addEventListener(type, handler, { ...options, signal: abort.signal });
    const editor = document.createElement('details'); editor.className = 'exp-menu-editor'; editor.dataset.expMenuSubmenu = '1';
    const summary = document.createElement('summary'); summary.textContent = 'Edit menu'; editor.append(summary);
    const categoryList = document.createElement('div'); categoryList.className = 'exp-menu-category-list'; editor.append(categoryList);
    const categoryGroups = new Map();
    const switches = new Map();
    const ordered = () => [...parent.children].filter(node => node.hasAttribute('data-exp-arrange-section'));
    function groupFor(category) {
      if (categoryGroups.has(category)) return categoryGroups.get(category);
      const group = document.createElement('div'); group.className = 'exp-menu-category-group'; group.dataset.expMenuCategoryGroup = category;
      const title = document.createElement('div'); title.className = 'exp-menu-category-title'; title.textContent = CATEGORY_META[category]?.label || 'Main';
      group.append(title); categoryList.append(group); categoryGroups.set(category, group); return group;
    }
    function apply() {
      const desired = [...entries].sort((a,b) => order.indexOf(a.key)-order.indexOf(b.key));
      desired.forEach((entry,index) => { const current = ordered()[index]; if (current !== entry.section) parent.insertBefore(entry.section,current || null); });
      entries.forEach(entry => {
        const isHidden = entry !== recovery && hidden.includes(entry.key);
        if (entry.section.hidden !== isHidden) entry.section.hidden = isHidden;
        switches.get(entry.key)?.setAttribute('aria-checked', String(!isHidden));
      });
      onChange();
    }
    function update() {
      collapseSubmenus(panel);
      const target = recovery.body.querySelector('[data-exp-system-tools]') || recovery.body;
      if (editor.parentElement !== target) target.append(editor);
    }
    for (const entry of entries) {
      entry.section.dataset.expArrangeSection = entry.key;
      const grip = document.createElement('button'); grip.type = 'button'; grip.className = 'exp-section-grip'; grip.textContent = '⠿';
      grip.setAttribute('aria-label', `Rearrange ${entry.label}`); grip.title = 'Drag to reorder, or use Alt + Up/Down'; entry.section.append(grip); entry.grip = grip;
      on(grip, 'click', event => { event.preventDefault(); event.stopPropagation(); });
      on(grip, 'pointerdown', event => {
        if (event.button !== 0 || drag) return;
        event.preventDefault(); event.stopPropagation();
        drag = { entry, pointer: event.pointerId, y: event.clientY, snapshot: [...order], moved: false };
        parent.setPointerCapture?.(event.pointerId); grip.dataset.dragging = 'true';
      });
      on(grip, 'keydown', event => {
        if (!event.altKey || !['ArrowUp','ArrowDown'].includes(event.key)) return;
        event.preventDefault(); event.stopPropagation();
        const visible = ordered().filter(node => !node.hidden).map(node => node.dataset.expArrangeSection);
        const from = visible.indexOf(entry.key), to = from + (event.key === 'ArrowUp' ? -1 : 1);
        if (to < 0 || to >= visible.length) return;
        const target = order.indexOf(visible[to]), source = order.indexOf(entry.key);
        [order[source], order[target]] = [order[target], order[source]];
        save(orderKey,order); apply(); grip.focus();
      });
      if (entry === recovery) continue;
      const row = document.createElement('div'); row.className = 'exp-menu-row';
      const label = document.createElement('span'); label.textContent = entry.label;
      const toggle = document.createElement('button'); toggle.type = 'button'; toggle.setAttribute('role','switch'); toggle.setAttribute('aria-label',`Show ${entry.label}`);
      switches.set(entry.key,toggle);
      on(toggle,'click',() => { hidden = hidden.includes(entry.key) ? hidden.filter(key => key !== entry.key) : [...hidden,entry.key]; save(hiddenKey,hidden); apply(); });
      row.append(label,toggle); groupFor(entry.category).append(row);
    }
    for (const category of CATEGORY_ORDER) {
      const group = categoryGroups.get(category);
      if (group) categoryList.append(group);
    }
    on(view,'pointermove',event => {
      if (!drag || event.pointerId !== drag.pointer || Math.abs(event.clientY-drag.y) < 5 && !drag.moved) return;
      event.preventDefault(); drag.moved = true;
      const others = ordered().filter(node => node !== drag.entry.section && !node.hidden);
      const next = others.find(node => { const rect=node.getBoundingClientRect(); return event.clientY < rect.top+rect.height/2; });
      order = order.filter(key => key !== drag.entry.key);
      const index = next ? order.indexOf(next.dataset.expArrangeSection) : others.length ? order.indexOf(others.at(-1).dataset.expArrangeSection)+1 : order.length;
      order.splice(index,0,drag.entry.key); apply();
    }, { passive:false });
    function end(event) {
      if (!drag || event.pointerId !== drag.pointer) return;
      const previous = drag; drag = null; delete previous.entry.grip.dataset.dragging;
      if (event.type !== 'pointerup') { order = previous.snapshot; apply(); } else save(orderKey,order);
      if (parent.hasPointerCapture?.(previous.pointer)) parent.releasePointerCapture(previous.pointer);
      previous.entry.grip.focus();
    }
    on(view,'pointerup',end); on(view,'pointercancel',end); on(parent,'lostpointercapture',end);
    on(view,'storage',event => { if ([orderKey,hiddenKey,null].includes(event.key) && !drag) { order=[...new Set([...read(orderKey),...defaults])]; hidden=read(hiddenKey); apply(); } });
    function resetButton(label, action) { const button=document.createElement('button');button.type='button';button.className='life-btn exp-reset';button.textContent=label;on(button,'click',action);editor.append(button); }
    resetButton('Reset menu arrangement',() => { order=[...defaults];hidden=[];save(orderKey,order);save(hiddenKey,hidden);apply(); });
    resetButton('Reset launcher arrangement',resetLaunchers);
    editor.open = false;
    apply(); update();
    return {
      update,
      describe: () => describe(id, entries.map(({key,label,category}) => ({ key, label, category }))),
      destroy() {
        abort.abort();style.remove();editor.remove();
        entries.forEach(entry => {
          entry.grip.remove();
          delete entry.section.dataset.expArrangeSection;
          delete entry.section.dataset.expMenuCategory;
          entry.section.hidden=false;
        });
      }
    };
  }

  return Object.freeze({
    categories: categoryList,
    categoryFor,
    describe,
    createDisclosure,
    collapseSubmenus,
    mount,
  });
})();

// Product-neutral shared runtime. Product engines own their settings, content, and actions.
// exp-core owns shared UI, launcher, diagnostics, update, and coordination behavior.
const ExtraPotionsCore = (() => {
  'use strict';
  const version = '3.4.0';
  const sourceVersion = version; // Backward-compatible alias for Core's own foundation version.
  const SUPPORT_URL = 'https://ko-fi.com/expdare';
  const protocol = 'exp-core-coordination-v1';
  const gridProtocol = 'exp-launcher-grid-v3';
  const GRID_ORDER = 'exp:v3:launcher-order';
  const GRID_DELTA = 'exp:v3:launcher-grid-delta';
  // Product importance, launcher placement, and theme ownership are separate
  // coordination policies backed by the same canonical suite manifest.
  const freezeSuiteContract = values => Object.freeze(Object.fromEntries(
    Object.entries(values || {}).map(([id, value]) => [id, Object.freeze({
      role: String(value?.role || 'product'),
      repository: String(value?.repository || ''),
      rootId: String(value?.rootId || ''),
      priority: Number(value?.priority || 0),
      launcherPriority: Number(value?.launcherPriority || 0),
      themePriority: Number(value?.themePriority || 0),
      capabilities: Object.freeze([...(value?.capabilities || [])]),
      presentationPhases: Object.freeze([...(value?.presentationPhases || [])]),
      menuSections: Object.freeze(Object.fromEntries(
        Object.entries(value?.menuSections || {}).map(([category, sections]) => [category, Object.freeze([...(sections || [])])])
      )),
      state: value?.state ? Object.freeze({
        type: String(value.state.type || ''),
        fields: Object.freeze({ ...(value.state.fields || {}) }),
      }) : null,
    })])
  ));
  const SUITE_PRODUCTS = freezeSuiteContract({"dropper":{"role":"flagship","priority":4,"launcherPriority":110,"themePriority":4,"capabilities":["twitch.drops","twitch.campaigns","twitch.progress","twitch.claims","twitch.stream-management"],"presentationPhases":[],"state":{"type":"dropper.state-changed","fields":{"activeReward":"boolean","progressPercent":"percent-nullable","routingState":"token"}},"menuSections":{"main":["drops","streams"],"appearance":["appearance"],"advanced":["advanced"],"system":["system"]},"repository":"Dropper","rootId":"tdh-root"},"shift":{"role":"product","priority":3,"launcherPriority":100,"themePriority":3,"capabilities":["appearance.theme","appearance.readability","appearance.site-profile"],"presentationPhases":["theme"],"state":{"type":"shift.state-changed","fields":{"active":"boolean","theme":"token","safeMode":"boolean","excluded":"boolean"}},"menuSections":{"appearance":["appearance","readability"],"advanced":["effects","effects-integrations","profiles","profiles-sites"],"system":["system"]},"repository":"SHIFT","rootId":"exp-shift-root"},"ward":{"role":"product","priority":2,"launcherPriority":60,"themePriority":1,"capabilities":["retail.classification","retail.cleanup","retail.coupons"],"presentationPhases":["classify","visibility"],"state":{"type":"ward.state-changed","fields":{"active":"boolean","pageType":"token","interventions":"count","hide":"count","dim":"count","collapse":"count","annotate":"count"}},"menuSections":{"main":["protection","amazon","tools"],"appearance":["appearance"],"advanced":["advanced","patterns","advanced-amazon"],"system":["system"]},"repository":"WARD","rootId":"exp-ward-root"},"prisma":{"role":"product","priority":1,"launcherPriority":40,"themePriority":2,"capabilities":["text.identity-detection","text.identity-highlighting","identity.catalog"],"presentationPhases":["annotate"],"state":{"type":"prisma.state-changed","fields":{"status":"token","total":"count","temporarilyHidden":"boolean"}},"menuSections":{"main":["page","highlights"],"appearance":["style","highlight-style","look","appearance"],"advanced":["tools","language","sites"],"system":["system"]},"repository":"PRISMA","rootId":"exp-prisma-root"}});
  const SUITE_PRIORITY = Object.freeze(Object.fromEntries(
    Object.entries(SUITE_PRODUCTS).map(([id, value]) => [id, value.priority])
  ));
  const LAUNCHER_PRIORITY = Object.freeze(Object.fromEntries(
    Object.entries(SUITE_PRODUCTS).map(([id, value]) => [id, value.launcherPriority])
  ));
  const THEME_PRIORITY = Object.freeze(Object.fromEntries(
    Object.entries(SUITE_PRODUCTS).map(([id, value]) => [id, value.themePriority])
  ));
  const SUITE_EVENT = 'exp-core:suite';
  // Suite events/state cross userscript realms through shared DOM metadata.
  // They are advisory coordination signals, never an authorization boundary.
  const SUITE_TRUST = 'shared-dom-advisory';
  const PAGE_BATCH_EVENT = 'exp-core:page-batch';
  const NAVIGATION_EVENT = 'exp-core:navigation';
  const NAVIGATION_CONTROL_EVENT = 'exp-core:navigation-control';
  const PAGE_PHASE_EVENT = 'exp-core:page-phase';
  const PAGE_PHASE_END_EVENT = 'exp-core:page-phase-end';
  const PRESENTATION_STATE_EVENT = 'exp-core:presentation-state';
  const PRESENTATION_PHASES = Object.freeze({
    observe: 10,
    classify: 20,
    visibility: 30,
    theme: 40,
    annotate: 50,
    ui: 60,
  });
  const PRESENTATION_CHANNELS = Object.freeze(['classification', 'visibility', 'surface', 'annotation']);
  const suiteStateFingerprints = new Map();
  const registrations = new WeakMap();
  const floatingNoticeRegistrations = new WeakMap();
  const controllers = new WeakMap();
  const baseTokenNames = ['bg', 'panel', 'line', 'text', 'muted', 'accent', 'accent2'];
  const tokenNames = [...baseTokenNames, 'raised', 'inset', 'link', 'focus', 'onAccent'];
  const hex = value => /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#000000';
  const rgb = value => [1, 3, 5].map(index => parseInt(hex(value).slice(index, index + 2), 16));
  const blend = (from, to, amount) => '#' + rgb(from).map((part, index) => Math.round(part + (rgb(to)[index] - part) * amount).toString(16).padStart(2, '0')).join('');
  const luminance = value => {
    const parts = rgb(value).map(part => { const channel = part / 255; return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4; });
    return .2126 * parts[0] + .7152 * parts[1] + .0722 * parts[2];
  };
  const contrast = (one, two) => { const [light, dark] = [luminance(one), luminance(two)].sort((a, b) => b - a); return (light + .05) / (dark + .05); };
  function readable(candidate, background, fallback) {
    if (contrast(candidate, background) >= 4.5) return candidate;
    for (let amount = .15; amount <= 1; amount += .05) {
      const lighter = blend(candidate, '#ffffff', amount);
      if (contrast(lighter, background) >= 4.5) return lighter;
      const darker = blend(candidate, '#000000', amount);
      if (contrast(darker, background) >= 4.5) return darker;
    }
    return fallback;
  }
  function semanticTheme(theme = {}) {
    const panel = hex(theme.panel);
    const background = hex(theme.bg);
    const onAccent = [hex(theme.text), background, '#ffffff', '#000000'].sort((a, b) => contrast(b, theme.accent) - contrast(a, theme.accent))[0];
    return {
      ...theme,
      raised: hex(theme.raised) !== '#000000' || theme.raised === '#000000' ? theme.raised : blend(panel, theme.text, .08),
      inset: hex(theme.inset) !== '#000000' || theme.inset === '#000000' ? theme.inset : blend(background, '#000000', .18),
      link: theme.link && contrast(theme.link, panel) >= 4.5 ? theme.link : readable(theme.accent2, panel, theme.text),
      focus: theme.focus && contrast(theme.focus, panel) >= 3 ? theme.focus : readable(theme.accent2, panel, theme.text),
      onAccent: theme.onAccent && contrast(theme.onAccent, theme.accent) >= 4.5 ? theme.onAccent : onAccent,
    };
  }
  // Callers own foreground, accessibility fallbacks, and removing these inline properties.
  // Settings use the persisted JSON schema. Parse in the caller's userscript realm
  // instead of returning a native structuredClone page-realm Xray wrapper.
  function cloneSettings(value) { return JSON.parse(JSON.stringify(value)); }
  function applyTextGradient(element, backgroundImage) {
    const properties = {'background-color':'transparent','background-image':backgroundImage,'background-clip':'text','-webkit-background-clip':'text','background-size':'auto','background-position':'0% 0%','background-repeat':'repeat'};
    for (const [property,value] of Object.entries(properties)) element.style.setProperty(property,value,'important');
  }
  function replaceMenuContent(container, content) {
    const summary = node => node.querySelector(':scope > summary')?.textContent.trim();
    const expanded = new Set([...container.querySelectorAll('details[open]')].map(summary));
    container.replaceChildren(content);
    for (const node of container.querySelectorAll('details')) if (expanded.has(summary(node))) node.open = true;
  }
  function createDisclosure(label, ...contents) {
    return ExpMenuArrangement.createDisclosure({
      document,
      label,
      category: 'advanced',
      contents,
      className: 'exp-system-card',
    });
  }
  function createSystemGrid(...contents) {
    const grid = document.createElement('div'); grid.dataset.expSystemTools = '1';
    grid.append(...contents); return grid;
  }
  function menuWidthForMode(mode = 'compact', fullWidth = 312) {
    if (mode === 'narrow') return 220;
    if (mode === 'compact') return 260;
    const full = Number(fullWidth);
    return Number.isFinite(full) ? Math.max(280, Math.min(full, 340)) : 312;
  }
  const canonicalCss = CoreFoundation.css();
  const compositionCss = `
    [data-exp-part="dock"]{box-sizing:border-box;overflow-x:hidden;overscroll-behavior:contain}
    [data-exp-part="dock"] :is(.row,.group,.section,.fl-tool-body,.route-body,.fl-tool-title){min-width:0;max-width:100%;overflow-wrap:anywhere!important}
    [data-exp-part="dock"] :is(input,select,textarea){min-width:0;max-width:100%}
    .update-notice,.changelog{max-height:calc(100vh - 24px)!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain;overflow-wrap:anywhere}

    [data-exp-system-tools]{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;align-items:stretch;grid-column:1/-1!important;min-width:0}
    [data-exp-system-tools]>details{box-sizing:border-box;min-width:0;margin:0!important;padding:7px!important;border:1px solid var(--theme-line);border-radius:7px;grid-column:auto!important;overflow-wrap:anywhere}
    [data-exp-system-tools]>details[open]{grid-column:1/-1!important}
    [data-exp-system-tools]>details>summary{cursor:pointer;font-weight:600}
    .exp-system-card>summary{cursor:pointer}
    .exp-system-card>summary+*{margin-top:6px}
    [data-exp-part="dock"] .row:has(>select[aria-label="Menu width"]){display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,104px)!important;align-items:center;gap:8px!important}
    [data-exp-part="dock"] .row>select[aria-label="Menu width"]{box-sizing:border-box;width:100%!important;max-width:104px!important;min-width:0!important;margin:0!important}
    :host{color-scheme:dark}
    [data-exp-part="launcher"]{box-sizing:border-box!important;width:48px!important;min-width:48px!important;max-width:48px!important;height:48px!important;min-height:48px!important;max-height:48px!important}
    [data-exp-part="launcher"] .launcher-icon{width:40px!important;height:40px!important}
    .header-icon{width:38px!important;height:38px!important}
    .header-icon .menu-icon{width:38px!important;height:38px!important}
    :host([data-exp-theme-deprioritized="1"]) .theme-row:has(.exp-theme-swatches),:host([data-exp-theme-deprioritized="1"]) #mb-theme-dots{display:none!important}
    :host([data-exp-theme-deprioritized="1"]) #mb-cluster{--mb-bg:var(--theme-bg)!important;--mb-surface:var(--theme-panel)!important;--mb-chip:var(--theme-raised)!important;--mb-ink:var(--theme-text)!important;--mb-muted:var(--theme-muted)!important;--mb-line:var(--theme-line)!important;--mb-brand:var(--theme-accent)!important;--mb-brand-ink:var(--theme-onAccent)!important;--mb-hover:var(--theme-raised)!important;--mb-track:var(--theme-line)!important}
    [hidden]{display:none!important}
    .exp-core-theme{position:static;display:contents;color:var(--theme-text);font:13px/1.42 ui-sans-serif,system-ui,"Segoe UI",sans-serif}
    [data-exp-part="dock"],[data-exp-part="launcher"]{position:fixed}
    [data-exp-part="dock"]{color:var(--theme-text);scrollbar-width:thin}
    [data-exp-part="dock"] [data-exp-part="title"]{color:var(--theme-text)}
    .exp-core-theme a{color:var(--theme-link)}
    button,input,select,textarea{font-family:inherit}
    button{color:inherit}
    button:disabled{opacity:.5;cursor:not-allowed}
    button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:2px solid var(--theme-focus);outline-offset:2px}
    button.fl-tool-header{width:100%;border:0;background:transparent;color:var(--theme-text);text-align:left;font:inherit}
    .fl-tool-header .fl-tool-chevron{font:11px/1.42 system-ui}
    .fl-tool-body[hidden]{display:none!important}
    .fl-tool-body>.group,.fl-tool-body>.section,.fl-tool-body>.flat-group{grid-column:1/-1;min-width:0}
    .fl-tool-body :is(.group,.section,.flat-group){display:grid!important;grid-template-columns:minmax(0,1fr)!important}
    .fl-tool-body :is(.group,.section,.flat-group)>*{grid-column:1/-1!important;min-width:0}
    .group,.section,.flat-group{margin:0;padding:0;border:0;background:transparent}
    .group>h3,.section>h3,.section>h2{margin:8px 0 3px;font-size:10px;font-weight:800;color:var(--theme-muted)}
    .group:first-child>h3,.section:first-child>h3{margin-top:6px}
    .group>.row,.section>.row,.flat-group>.row{min-width:0}
    .row>.copy,.row>.row-copy,.row>.setting-label,.row>div:first-child{min-width:0;flex:1}
    .label,.copy>strong,.row-copy>strong,.setting-label{font-size:11px;font-weight:500;line-height:1.25}
    .copy>.help,.row-copy>small,.help,.empty,.note,.meta{font-size:9px;line-height:1.4;color:var(--theme-muted)}
    .copy>.help,.row-copy>small{display:block;margin-top:3px}
    .toggleSwitch{padding:0;min-width:34px;max-width:34px;min-height:20px;max-height:20px}
    .toggleSwitch>span{display:none}
    .row>.life-btn,.mini-row>.life-btn{width:auto;min-width:50px;margin:0;padding:3px 7px}
    .row>select,.mini-row>select{max-width:55%}
    .button-grid,.actions,.profile-actions,.menu-footer,.diagnostics-controls>div,.rules-transfer{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;min-width:0}
    .button-grid>*{min-width:0}
    .life-btn.warn{border-color:#cb6868!important;background:#402020!important;color:#ffd7d7!important}
    input:not([type=file]),textarea{box-sizing:border-box;max-width:100%;min-width:0;border:1px solid var(--theme-line);border-radius:6px;background:var(--theme-inset);color:var(--theme-text);padding:5px 6px;font-size:11px}
    input[type=search],textarea{width:100%}
    .identity{display:flex;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--theme-line)}
    .identity>.copy{flex:1;min-width:0}
    .identity-actions{display:flex;gap:6px;align-items:center}
    .identity-actions>.life-btn{width:auto;margin:0;padding:3px 6px}
    .theme-row{flex-wrap:wrap}
    .exp-theme-swatches{min-width:0}
    .appearance-group,.auth-advanced,.rule-card,.stat-card{grid-column:1/-1;min-width:0;border:1px solid var(--theme-line);border-radius:7px;margin-top:6px;padding:6px;background:var(--theme-inset)}
    summary{cursor:pointer;font-size:11px}
    .feature-pair,.category-grid{display:block}
    .status-value,output{font-size:10px;color:var(--theme-muted)}
    .live,.sr-only,.status{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
    .toast{position:fixed;z-index:2147483647;right:12px;max-width:calc(100vw - 24px)}
    .update-notice{position:fixed;z-index:2147483647}
    .diag{margin:6px 0 0}
    .diag[hidden]{display:none!important}
    .diag:not([hidden]){display:block}
    .utility-grid,.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
    .workspace-actions{grid-column:1/-1}
    .setting-arrow,.step-btn{width:25px;min-height:25px;border:1px solid var(--theme-line);border-radius:6px;background:var(--theme-raised);color:var(--theme-text)}
    .step-value{flex:1;text-align:center;font-size:10px}
    .stepper{display:flex;align-items:center;gap:5px}
  `;
  const TOGGLE = ':is(.toggleSwitch,.switch,[role="switch"])';
  const TOGGLE_BG = 'var(--theme-bg,var(--dropper-bg,var(--bg,#111114)))';
  const TOGGLE_PANEL = 'var(--theme-panel,var(--dropper-panel,var(--panel,var(--surface,#18181d))))';
  const TOGGLE_LINE = 'var(--theme-line,var(--dropper-line,var(--line,var(--border,#41434d))))';
  const TOGGLE_MUTED = 'var(--theme-muted,var(--dropper-muted,var(--muted,#9aa0a6)))';
  const TOGGLE_TEXT = 'var(--theme-text,var(--dropper-text,var(--text,#f4f4f6)))';
  const TOGGLE_ACCENT = 'var(--theme-accent,var(--dropper-accent,var(--accent,var(--teal,#8b5cf6))))';
  const MATTE_TOGGLE_CHROME_CSS = `${TOGGLE}{position:relative!important;box-sizing:border-box!important;flex:none!important;width:34px!important;height:20px!important;min-width:34px!important;min-height:20px!important;padding:0!important;border:1px solid color-mix(in srgb,${TOGGLE_LINE} 88%,${TOGGLE_MUTED} 12%)!important;border-radius:6px!important;background:color-mix(in srgb,${TOGGLE_BG} 84%,${TOGGLE_PANEL} 16%)!important;background-image:none!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.018)!important;cursor:pointer!important}${TOGGLE}:not(:has(> span))::after{content:""!important;position:absolute!important;top:2px!important;left:2px!important;width:14px!important;height:14px!important;box-sizing:border-box!important;border:0!important;border-radius:4px!important;background:color-mix(in srgb,${TOGGLE_MUTED} 82%,${TOGGLE_TEXT} 18%)!important;box-shadow:none!important}${TOGGLE}>span{display:block!important;position:absolute!important;top:2px!important;left:2px!important;width:14px!important;height:14px!important;box-sizing:border-box!important;border:0!important;border-radius:4px!important;background:color-mix(in srgb,${TOGGLE_MUTED} 82%,${TOGGLE_TEXT} 18%)!important;box-shadow:none!important}${TOGGLE}[aria-checked="true"]{border-color:color-mix(in srgb,${TOGGLE_LINE} 52%,${TOGGLE_ACCENT} 48%)!important;background:color-mix(in srgb,${TOGGLE_PANEL} 72%,${TOGGLE_ACCENT} 28%)!important;background-image:none!important}${TOGGLE}[aria-checked="true"]:not(:has(> span))::after{transform:translateX(14px)!important;background:${TOGGLE_TEXT}!important}${TOGGLE}[aria-checked="true"]>span{transform:translateX(14px)!important;background:${TOGGLE_TEXT}!important}:host([data-ui-theme="pride"]) ${TOGGLE}[aria-checked="true"],.exp-core-theme[data-ui-theme="pride"] ${TOGGLE}[aria-checked="true"],:host([data-theme-skin="gradient"]) ${TOGGLE}[aria-checked="true"],.exp-core-theme[data-theme-skin="gradient"]:not([data-ui-theme="contrast"]) ${TOGGLE}[aria-checked="true"]{background-image:none!important;border-color:color-mix(in srgb,${TOGGLE_LINE} 52%,${TOGGLE_ACCENT} 48%)!important;background:color-mix(in srgb,${TOGGLE_PANEL} 72%,${TOGGLE_ACCENT} 28%)!important}:host([data-ui-theme="contrast"]) ${TOGGLE},:host([data-ui-theme="obsidian"]) ${TOGGLE},.exp-core-theme[data-ui-theme="contrast"] ${TOGGLE},.exp-core-theme[data-ui-theme="obsidian"] ${TOGGLE}{border:2px solid #fff!important;background:#050505!important;background-image:none!important}:host([data-ui-theme="contrast"]) ${TOGGLE}:not(:has(> span))::after,:host([data-ui-theme="obsidian"]) ${TOGGLE}:not(:has(> span))::after,.exp-core-theme[data-ui-theme="contrast"] ${TOGGLE}:not(:has(> span))::after,.exp-core-theme[data-ui-theme="obsidian"] ${TOGGLE}:not(:has(> span))::after{top:0!important;left:0!important;border:1px solid #050505!important;background:#fff!important}:host([data-ui-theme="contrast"]) ${TOGGLE}>span,:host([data-ui-theme="obsidian"]) ${TOGGLE}>span,.exp-core-theme[data-ui-theme="contrast"] ${TOGGLE}>span,.exp-core-theme[data-ui-theme="obsidian"] ${TOGGLE}>span{top:0!important;left:0!important;border:1px solid #050505!important;background:#fff!important}:host([data-ui-theme="contrast"]) ${TOGGLE}[aria-checked="true"],:host([data-ui-theme="obsidian"]) ${TOGGLE}[aria-checked="true"],.exp-core-theme[data-ui-theme="contrast"] ${TOGGLE}[aria-checked="true"],.exp-core-theme[data-ui-theme="obsidian"] ${TOGGLE}[aria-checked="true"]{background:#fff!important;border-color:#fff!important;background-image:none!important}:host([data-ui-theme="contrast"]) ${TOGGLE}[aria-checked="true"]:not(:has(> span))::after,:host([data-ui-theme="obsidian"]) ${TOGGLE}[aria-checked="true"]:not(:has(> span))::after,.exp-core-theme[data-ui-theme="contrast"] ${TOGGLE}[aria-checked="true"]:not(:has(> span))::after,.exp-core-theme[data-ui-theme="obsidian"] ${TOGGLE}[aria-checked="true"]:not(:has(> span))::after{background:#050505!important;border-color:#fff!important;transform:translateX(14px)!important}:host([data-ui-theme="contrast"]) ${TOGGLE}[aria-checked="true"]>span,:host([data-ui-theme="obsidian"]) ${TOGGLE}[aria-checked="true"]>span,.exp-core-theme[data-ui-theme="contrast"] ${TOGGLE}[aria-checked="true"]>span,.exp-core-theme[data-ui-theme="obsidian"] ${TOGGLE}[aria-checked="true"]>span{background:#050505!important;border-color:#fff!important;transform:translateX(14px)!important}@media (forced-colors: active){${TOGGLE}{forced-color-adjust:none;border:1px solid CanvasText!important;background:Canvas!important;background-image:none!important}${TOGGLE}:not(:has(> span))::after{border-color:CanvasText!important;background:CanvasText!important}${TOGGLE}>span{border-color:CanvasText!important;background:CanvasText!important}${TOGGLE}[aria-checked="true"]{border-color:Highlight!important;background:Highlight!important;background-image:none!important}${TOGGLE}[aria-checked="true"]:not(:has(> span))::after{border-color:HighlightText!important;background:HighlightText!important}${TOGGLE}[aria-checked="true"]>span{border-color:HighlightText!important;background:HighlightText!important}}`;
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const emit = (type, productId) => document.dispatchEvent(new CustomEvent('exp-core:coordination', { detail: { protocol, type, productId } }));

  function normalizeSuiteCapabilities(values = []) {
    if (!Array.isArray(values)) return [];
    return [...new Set(values.map(value => String(value || '').trim().toLowerCase()).filter(value => /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/.test(value)))];
  }

  function suiteContract(productId) {
    const id = String(productId || '').toLowerCase();
    const known = SUITE_PRODUCTS[id];
    if (!known) return null;
    return Object.freeze({
      id,
      role: known.role || 'product',
      repository: known.repository || '',
      rootId: known.rootId || '',
      priority: Number(known.priority || SUITE_PRIORITY[id] || 0),
      launcherPriority: Number(known.launcherPriority || LAUNCHER_PRIORITY[id] || 0),
      themePriority: Number(known.themePriority || THEME_PRIORITY[id] || 0),
      capabilities: Object.freeze(normalizeSuiteCapabilities(known.capabilities)),
      presentationPhases: Object.freeze(normalizePresentationPhases(known.presentationPhases || [])),
      menuSections: Object.freeze(Object.fromEntries(
        Object.entries(known.menuSections || {}).map(([category, sections]) => [category, Object.freeze([...sections])])
      )),
      state: known.state ? Object.freeze({
        type: known.state.type,
        fields: Object.freeze({ ...known.state.fields }),
      }) : null,
    });
  }

  function suiteProductNode(productId) {
    const id = String(productId || '').toLowerCase();
    if (!/^[a-z][a-z0-9-]+$/.test(id)) return null;
    return [...document.querySelectorAll('[data-exp-suite-product]')]
      .find(node => node.dataset.expSuiteProduct === id) || null;
  }

  function registerSuiteProduct(options = {}) {
    const id = String(options.id || options.productId || '').toLowerCase();
    const productVersion = String(options.version || options.productVersion || 'unknown');
    if (!/^[a-z][a-z0-9-]+$/.test(id)) throw new Error('Invalid suite product ID');
    const contract = suiteContract(id);
    const capabilities = normalizeSuiteCapabilities(contract ? contract.capabilities : options.capabilities);
    const priority = Number(contract?.priority ?? options.priority ?? 0);
    const role = String(contract?.role ?? options.role ?? 'product');
    let node = suiteProductNode(id);
    const previous = node ? JSON.stringify({
      version: node.dataset.expSuiteVersion || '',
      coreVersion: node.dataset.expSuiteCoreVersion || '',
      role: node.dataset.expSuiteRole || '',
      priority: node.dataset.expSuitePriority || '',
      capabilities: node.dataset.expSuiteCapabilities || '[]',
    }) : null;
    if (!node) {
      node = document.createElement('meta');
      node.dataset.expSuiteProduct = id;
      (document.documentElement || document.head || document.body)?.append(node);
    }
    node.dataset.expSuiteVersion = productVersion;
    node.dataset.expSuiteCoreVersion = version;
    node.dataset.expSuiteRole = role;
    node.dataset.expSuitePriority = String(Number.isFinite(priority) ? priority : 0);
    node.dataset.expSuiteCapabilities = JSON.stringify(capabilities);
    const current = JSON.stringify({
      version: node.dataset.expSuiteVersion,
      coreVersion: node.dataset.expSuiteCoreVersion,
      role: node.dataset.expSuiteRole,
      priority: node.dataset.expSuitePriority,
      capabilities: node.dataset.expSuiteCapabilities,
    });
    if (previous !== current) emitSuiteEvent(id, 'product.registered', { capabilities, role, version: productVersion });
    return Object.freeze({
      id,
      update(next = {}) { return registerSuiteProduct({ id, version: productVersion, role, priority, capabilities, ...next }); },
      dispose() {
        const current = suiteProductNode(id);
        if (current === node) current.remove();
        emitSuiteEvent(id, 'product.unregistered', {});
      },
    });
  }

  function suiteSnapshot() {
    const products = [...document.querySelectorAll('[data-exp-suite-product]')].map(node => {
      let capabilities = [];
      try { capabilities = normalizeSuiteCapabilities(JSON.parse(node.dataset.expSuiteCapabilities || '[]')); } catch {}
      return Object.freeze({
        id: node.dataset.expSuiteProduct,
        version: node.dataset.expSuiteVersion || 'unknown',
        coreVersion: node.dataset.expSuiteCoreVersion || 'unknown',
        role: node.dataset.expSuiteRole || 'product',
        priority: Number(node.dataset.expSuitePriority || 0),
        capabilities: Object.freeze(capabilities),
      });
    }).filter(product => product.id)
      .sort((left, right) => right.priority - left.priority || left.id.localeCompare(right.id));
    return Object.freeze({
      protocol: 'exp-suite-interoperability-v1',
      coreVersion: version,
      trust: SUITE_TRUST,
      products: Object.freeze(products),
    });
  }

  function capabilityProviders(capability) {
    const name = String(capability || '').trim().toLowerCase();
    return Object.freeze(suiteSnapshot().products.filter(product => product.capabilities.includes(name)));
  }

  function hasProductCapability(capability) {
    return capabilityProviders(capability).length > 0;
  }

  function pageContext() {
    return Object.freeze({
      href: location.href,
      origin: location.origin,
      hostname: location.hostname,
      pathname: location.pathname,
      topLevel: window.top === window.self,
    });
  }

  function navigationObserverMarker() {
    return document.querySelector('meta[data-exp-navigation-observer]');
  }

  function ensureSharedNavigationObserver(owner = 'core') {
    let marker = navigationObserverMarker();
    if (marker) return Object.freeze({ leader: false, owner: marker.dataset.expNavigationObserver || 'unknown' });
    marker = document.createElement('meta');
    marker.dataset.expOwned = '1';
    marker.dataset.expNavigationObserver = String(owner || 'core').toLowerCase();
    marker.dataset.expNavigationProtocol = 'exp-navigation-observer-v1';
    marker.dataset.expNavigationEpoch = '0';
    marker.dataset.expNavigationSubscribers = '0';
    (document.head || document.documentElement || document.body)?.append(marker);

    let previous = location.href;
    let epoch = 0;
    let pendingHistoryKind = '';
    let disposed = false;
    const publish = kind => {
      if (disposed) return false;
      const href = location.href;
      if (href === previous) return false;
      previous = href;
      epoch += 1;
      marker.dataset.expNavigationEpoch = String(epoch);
      const payload = JSON.stringify({
        protocol: 'exp-navigation-observer-v1',
        owner: marker.dataset.expNavigationObserver,
        epoch,
        kind: String(kind || 'navigation'),
        href,
        at: Date.now(),
      });
      document.dispatchEvent(new CustomEvent(NAVIGATION_EVENT, { detail: payload }));
      return true;
    };
    const originals = {};
    const wrappers = {};
    for (const name of ['pushState', 'replaceState']) {
      const original = history[name];
      originals[name] = original;
      const wrapped = function (...args) {
        const priorKind = pendingHistoryKind;
        pendingHistoryKind = name;
        try {
          const result = Reflect.apply(original, this, args);
          publish(name);
          return result;
        } finally {
          pendingHistoryKind = priorKind;
        }
      };
      wrappers[name] = wrapped;
      history[name] = wrapped;
    }
    const onPopState = () => publish('popstate');
    const onHashChange = () => publish('hashchange');
    const onCurrentEntryChange = () => publish(pendingHistoryKind || 'currententrychange');
    addEventListener('popstate', onPopState);
    addEventListener('hashchange', onHashChange);
    globalThis.navigation?.addEventListener('currententrychange', onCurrentEntryChange);
    const teardown = () => {
      if (disposed || Number(marker.dataset.expNavigationSubscribers || 0) > 0) return false;
      disposed = true;
      for (const name of Object.keys(wrappers)) if (history[name] === wrappers[name]) history[name] = originals[name];
      removeEventListener('popstate', onPopState);
      removeEventListener('hashchange', onHashChange);
      globalThis.navigation?.removeEventListener('currententrychange', onCurrentEntryChange);
      document.removeEventListener(NAVIGATION_CONTROL_EVENT, onControl);
      if (marker.isConnected) marker.remove();
      return true;
    };
    const onControl = event => {
      let payload;
      try { payload = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail; } catch { return; }
      if (!payload || payload.protocol !== 'exp-navigation-observer-v1' || payload.type !== 'release-if-idle') return;
      teardown();
    };
    document.addEventListener(NAVIGATION_CONTROL_EVENT, onControl);
    return Object.freeze({ leader: true, owner: marker.dataset.expNavigationObserver });
  }

  function observeNavigation(callback, options = {}) {
    if (typeof callback !== 'function') throw new TypeError('Navigation callback must be a function');
    ensureSharedNavigationObserver(options.productId || options.owner || 'core');
    let marker = navigationObserverMarker();
    if (marker) marker.dataset.expNavigationSubscribers = String(Number(marker.dataset.expNavigationSubscribers || 0) + 1);
    const listener = event => {
      let payload;
      try { payload = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail; } catch { return; }
      if (!payload || payload.protocol !== 'exp-navigation-observer-v1') return;
      callback(Object.freeze({ ...payload }));
    };
    document.addEventListener(NAVIGATION_EVENT, listener);
    let disposed = false;
    return () => {
      if (disposed) return;
      disposed = true;
      document.removeEventListener(NAVIGATION_EVENT, listener);
      marker = navigationObserverMarker();
      if (!marker) return;
      const next = Math.max(0, Number(marker.dataset.expNavigationSubscribers || 0) - 1);
      marker.dataset.expNavigationSubscribers = String(next);
      if (!next) document.dispatchEvent(new CustomEvent(NAVIGATION_CONTROL_EVENT, {
        detail: JSON.stringify({ protocol: 'exp-navigation-observer-v1', type: 'release-if-idle' }),
      }));
    };
  }

  function navigationObserverState() {
    const marker = navigationObserverMarker();
    return Object.freeze({
      active: Boolean(marker),
      owner: marker?.dataset.expNavigationObserver || null,
      protocol: marker?.dataset.expNavigationProtocol || null,
      epoch: Number(marker?.dataset.expNavigationEpoch || 0),
      subscribers: Number(marker?.dataset.expNavigationSubscribers || 0),
    });
  }

  function emitSuiteEvent(productId, type, detail = {}) {
    const source = String(productId || 'core').toLowerCase();
    const eventType = String(type || '').trim().toLowerCase();
    if (!/^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/.test(eventType)) throw new Error('Invalid suite event type');
    let safeDetail = {};
    try { safeDetail = JSON.parse(JSON.stringify(detail || {})); } catch {}
    const payload = JSON.stringify({
      protocol: 'exp-suite-interoperability-v1',
      coreVersion: version,
      trust: SUITE_TRUST,
      source,
      type: eventType,
      detail: safeDetail,
      at: Date.now(),
    });
    document.dispatchEvent(new CustomEvent(SUITE_EVENT, { detail: payload }));
  }

  function stableSuiteValue(value) {
    if (Array.isArray(value)) return value.map(stableSuiteValue);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stableSuiteValue(value[key])]));
  }

  function normalizeSuiteStateForContract(productId, type, state = {}) {
    const source = String(productId || '').toLowerCase();
    const eventType = String(type || '').trim().toLowerCase();
    const contract = suiteContract(source);
    const schema = contract?.state;
    const input = state && typeof state === 'object' && !Array.isArray(state) ? state : {};
    if (!schema || schema.type !== eventType) return stableSuiteValue(input);
    const keys = Object.keys(input);
    const expected = Object.keys(schema.fields);
    const unknown = keys.filter(key => !Object.hasOwn(schema.fields, key));
    if (unknown.length) throw new Error(`Unknown suite state field: ${unknown[0]}`);
    const missing = expected.filter(key => !Object.hasOwn(input, key));
    if (missing.length) throw new Error(`Missing suite state field: ${missing[0]}`);
    const output = {};
    for (const [key, kind] of Object.entries(schema.fields)) {
      const value = input[key];
      if (kind === 'boolean') {
        if (typeof value !== 'boolean') throw new Error(`Invalid boolean suite state field: ${key}`);
        output[key] = value;
      } else if (kind === 'token') {
        const token = String(value ?? '').trim().toLowerCase();
        if (!/^[a-z0-9][a-z0-9._:-]{0,79}$/.test(token)) throw new Error(`Invalid token suite state field: ${key}`);
        output[key] = token;
      } else if (kind === 'count') {
        const count = Number(value);
        if (!Number.isSafeInteger(count) || count < 0) throw new Error(`Invalid count suite state field: ${key}`);
        output[key] = count;
      } else if (kind === 'percent-nullable') {
        if (value === null) output[key] = null;
        else {
          const percent = Number(value);
          if (!Number.isFinite(percent) || percent < 0 || percent > 100) throw new Error(`Invalid percent suite state field: ${key}`);
          output[key] = percent;
        }
      } else {
        throw new Error(`Unsupported suite state schema kind: ${kind}`);
      }
    }
    return stableSuiteValue(output);
  }

  function suiteStateNode(productId, type) {
    const source = String(productId || '').toLowerCase();
    const eventType = String(type || '').trim().toLowerCase();
    return [...document.querySelectorAll('meta[data-exp-suite-state-product][data-exp-suite-state-type]')]
      .find(node => node.dataset.expSuiteStateProduct === source && node.dataset.expSuiteStateType === eventType) || null;
  }

  function readSuiteStateNode(node) {
    if (!(node instanceof Element)) return null;
    let state = {};
    try { state = JSON.parse(node.dataset.expSuiteStatePayload || '{}'); } catch {}
    return Object.freeze({
      productId: node.dataset.expSuiteStateProduct || '',
      type: node.dataset.expSuiteStateType || '',
      coreVersion: node.dataset.expSuiteStateCoreVersion || 'unknown',
      trust: node.dataset.expSuiteStateTrust || SUITE_TRUST,
      at: Number(node.dataset.expSuiteStateAt || 0),
      state: Object.freeze(stableSuiteValue(state && typeof state === 'object' ? state : {})),
    });
  }

  function suiteStateSnapshot(productId = '') {
    const source = String(productId || '').toLowerCase();
    return Object.freeze(
      [...document.querySelectorAll('meta[data-exp-suite-state-product][data-exp-suite-state-type]')]
        .filter(node => !source || node.dataset.expSuiteStateProduct === source)
        .map(readSuiteStateNode)
        .filter(Boolean)
        .sort((left, right) => left.productId.localeCompare(right.productId) || left.type.localeCompare(right.type))
    );
  }

  function latestSuiteState(productId, type = '') {
    const source = String(productId || '').toLowerCase();
    const eventType = String(type || '').trim().toLowerCase();
    const states = suiteStateSnapshot(source).filter(entry => !eventType || entry.type === eventType);
    return states.sort((left, right) => right.at - left.at)[0] || null;
  }

  function publishSuiteState(productId, type, state = {}) {
    const source = String(productId || '').toLowerCase();
    const eventType = String(type || '').trim().toLowerCase();
    if (!/^[a-z][a-z0-9-]+$/.test(source)) throw new Error('Invalid suite state product ID');
    if (!/^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/.test(eventType)) throw new Error('Invalid suite state event type');
    let safeState = {};
    try {
      safeState = normalizeSuiteStateForContract(source, eventType, JSON.parse(JSON.stringify(state || {})));
    } catch (error) {
      throw error;
    }
    const serialized = JSON.stringify(safeState);
    if (serialized.length > 4096) throw new Error('Suite state payload exceeds 4096 bytes');
    const key = `${source}:${eventType}`;
    let node = suiteStateNode(source, eventType);
    const sharedFingerprint = node?.dataset.expSuiteStatePayload || '';
    if (sharedFingerprint === serialized || suiteStateFingerprints.get(key) === serialized) return false;
    suiteStateFingerprints.set(key, serialized);
    if (!node) {
      node = document.createElement('meta');
      node.dataset.expOwned = '1';
      node.dataset.expSuiteStateProduct = source;
      node.dataset.expSuiteStateType = eventType;
      (document.head || document.documentElement || document.body)?.append(node);
    }
    node.dataset.expSuiteStatePayload = serialized;
    node.dataset.expSuiteStateCoreVersion = version;
    node.dataset.expSuiteStateTrust = SUITE_TRUST;
    node.dataset.expSuiteStateAt = String(Date.now());
    emitSuiteEvent(source, eventType, safeState);
    return true;
  }

  function onSuiteEvent(callback, options = {}) {
    if (typeof callback !== 'function') throw new TypeError('Suite event callback must be a function');
    const expectedType = options.type ? String(options.type).toLowerCase() : null;
    const listener = event => {
      let payload;
      try { payload = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail; } catch { return; }
      if (!payload || payload.protocol !== 'exp-suite-interoperability-v1') return;
      if (expectedType && payload.type !== expectedType) return;
      callback(payload);
    };
    document.addEventListener(SUITE_EVENT, listener);
    return () => document.removeEventListener(SUITE_EVENT, listener);
  }

  function subscribeSuiteState(productId, callback, options = {}) {
    if (typeof callback !== 'function') throw new TypeError('Suite state callback must be a function');
    const source = String(productId || '').toLowerCase();
    if (!/^[a-z][a-z0-9-]+$/.test(source)) throw new Error('Invalid suite state product ID');
    const contractType = suiteContract(source)?.state?.type || '';
    const eventType = String(options.type || contractType).trim().toLowerCase();
    if (eventType && !/^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/.test(eventType)) throw new Error('Invalid suite state event type');
    let disposed = false;
    const deliver = entry => {
      if (disposed || !entry) return;
      callback(Object.freeze({ ...entry, state: Object.freeze(stableSuiteValue(entry.state || {})) }));
    };
    if (options.immediate !== false) deliver(latestSuiteState(source, eventType));
    const stop = onSuiteEvent(event => {
      if (event.source !== source) return;
      if (eventType && event.type !== eventType) return;
      deliver(latestSuiteState(source, eventType));
    }, eventType ? { type: eventType } : {});
    return () => {
      if (disposed) return;
      disposed = true;
      stop();
    };
  }

  function normalizePresentationPhases(values = []) {
    const list = Array.isArray(values) ? values : [values];
    return [...new Set(list.map(value => String(value || '').trim().toLowerCase()).filter(value => PRESENTATION_PHASES[value]))]
      .sort((left, right) => PRESENTATION_PHASES[left] - PRESENTATION_PHASES[right]);
  }

  function presentationProviderNode(productId) {
    const id = String(productId || '').toLowerCase();
    if (!/^[a-z][a-z0-9-]+$/.test(id)) return null;
    return [...document.querySelectorAll('[data-exp-presentation-provider]')]
      .find(node => node.dataset.expPresentationProvider === id) || null;
  }

  function registerPresentationProvider(options = {}) {
    const id = String(options.id || options.productId || '').toLowerCase();
    if (!/^[a-z][a-z0-9-]+$/.test(id)) throw new Error('Invalid presentation product ID');
    const contract = suiteContract(id);
    if (contract && !contract.presentationPhases.length) throw new Error('Presentation provider is not declared for this suite product');
    const phases = normalizePresentationPhases(contract ? contract.presentationPhases : options.phases || options.phase);
    if (!phases.length) throw new Error('Presentation provider requires at least one valid phase');
    let node = presentationProviderNode(id);
    const previous = node ? JSON.stringify({
      phases: node.dataset.expPresentationPhases || '[]',
      priority: node.dataset.expPresentationPriority || '',
    }) : null;
    if (!node) {
      node = document.createElement('meta');
      node.dataset.expPresentationProvider = id;
      (document.documentElement || document.head || document.body)?.append(node);
    }
    node.dataset.expPresentationPhases = JSON.stringify(phases);
    node.dataset.expPresentationPriority = String(Number(contract?.priority ?? options.priority ?? 0) || 0);
    const current = JSON.stringify({
      phases: node.dataset.expPresentationPhases,
      priority: node.dataset.expPresentationPriority,
    });
    if (previous !== current) emitSuiteEvent(id, 'presentation.provider-registered', { phases });
    return Object.freeze({
      id,
      phases: Object.freeze([...phases]),
      dispose() {
        const current = presentationProviderNode(id);
        if (current === node) current.remove();
        emitSuiteEvent(id, 'presentation.provider-unregistered', {});
      },
    });
  }

  function presentationProviders() {
    return Object.freeze([...document.querySelectorAll('[data-exp-presentation-provider]')].map(node => {
      let phases = [];
      try { phases = normalizePresentationPhases(JSON.parse(node.dataset.expPresentationPhases || '[]')); } catch {}
      return Object.freeze({
        id: node.dataset.expPresentationProvider,
        phases: Object.freeze(phases),
        priority: Number(node.dataset.expPresentationPriority || 0),
      });
    }).filter(provider => provider.id)
      .sort((left, right) => {
        const leftPhase = Math.min(...left.phases.map(phase => PRESENTATION_PHASES[phase]));
        const rightPhase = Math.min(...right.phases.map(phase => PRESENTATION_PHASES[phase]));
        return leftPhase - rightPhase || right.priority - left.priority || left.id.localeCompare(right.id);
      }));
  }

  function suiteHealth() {
    const suite = suiteSnapshot();
    const providers = presentationProviders();
    const providerMap = new Map(providers.map(provider => [provider.id, provider]));
    const conflicts = [];
    const sameList = (left = [], right = []) => left.length === right.length && left.every((value, index) => value === right[index]);
    const products = suite.products.map(product => {
      const contract = suiteContract(product.id);
      if (!contract) {
        conflicts.push({ type: 'unknown-suite-product', products: [product.id] });
        return Object.freeze({ id: product.id, status: 'unknown-product' });
      }
      const expectedCapabilities = [...contract.capabilities].sort();
      const actualCapabilities = [...product.capabilities].sort();
      const provider = providerMap.get(product.id) || null;
      const expectedPhases = [...contract.presentationPhases];
      const actualPhases = provider ? [...provider.phases] : [];
      if (product.role !== contract.role) conflicts.push({ type: 'suite-role-mismatch', products: [product.id], expected: contract.role, actual: product.role });
      if (product.priority !== contract.priority) conflicts.push({ type: 'suite-priority-mismatch', products: [product.id], expected: contract.priority, actual: product.priority });
      if (!sameList(actualCapabilities, expectedCapabilities)) conflicts.push({ type: 'suite-capability-mismatch', products: [product.id], expected: expectedCapabilities, actual: actualCapabilities });
      if (expectedPhases.length && !provider) conflicts.push({ type: 'missing-presentation-provider', products: [product.id], expected: expectedPhases });
      if (!expectedPhases.length && provider) conflicts.push({ type: 'unexpected-presentation-provider', products: [product.id], actual: actualPhases });
      if (provider && !sameList(actualPhases, expectedPhases)) conflicts.push({ type: 'presentation-phase-mismatch', products: [product.id], expected: expectedPhases, actual: actualPhases });
      const latestState = latestSuiteState(product.id);
      return Object.freeze({
        id: product.id,
        status: conflicts.some(conflict => conflict.products?.includes(product.id)) ? 'conflict' : 'healthy',
        coreVersion: product.coreVersion,
        capabilities: Object.freeze(actualCapabilities),
        presentationPhases: Object.freeze(actualPhases),
        stateType: latestState?.type || null,
        stateAt: latestState?.at || 0,
        stateAgeMs: latestState?.at ? Math.max(0, Date.now() - latestState.at) : null,
        state: latestState?.state || null,
      });
    });
    const coreVersions = [...new Set(
      [...document.querySelectorAll('meta[data-exp-diagnostics-product]')]
        .map(node => node.dataset.expCoreVersion)
        .filter(Boolean)
    )].sort();
    if (coreVersions.length > 1) conflicts.push({ type: 'mixed-core-versions', coreVersions });
    const observerCount = document.querySelectorAll('meta[data-exp-page-observer]').length;
    if (observerCount > 1) conflicts.push({ type: 'duplicate-page-observer', instances: observerCount });
    return Object.freeze({
      status: conflicts.length ? 'conflicts-detected' : 'healthy',
      coreVersions: Object.freeze(coreVersions),
      observerCount,
      products: Object.freeze(products),
      conflicts: Object.freeze(conflicts.map(conflict => Object.freeze({ ...conflict }))),
    });
  }

  function readPresentationState(target) {
    if (!(target instanceof Element)) return Object.freeze({});
    try {
      const value = JSON.parse(target.getAttribute('data-exp-presentation-state') || '{}');
      if (!value || typeof value !== 'object' || Array.isArray(value)) return Object.freeze({});
      return Object.freeze(Object.fromEntries(Object.entries(value).map(([productId, state]) => [
        productId,
        Object.freeze({ ...(state && typeof state === 'object' && !Array.isArray(state) ? state : {}) }),
      ])));
    } catch {
      return Object.freeze({});
    }
  }

  function setPresentationState(target, productId, patch = {}) {
    if (!(target instanceof Element)) throw new TypeError('Presentation target must be an Element');
    const id = String(productId || '').toLowerCase();
    if (!/^[a-z][a-z0-9-]+$/.test(id)) throw new Error('Invalid presentation product ID');
    const previous = target.getAttribute('data-exp-presentation-state') || '';
    const current = JSON.parse(JSON.stringify(readPresentationState(target)));
    const next = { ...(current[id] || {}) };
    for (const [channel, raw] of Object.entries(patch || {})) {
      if (!PRESENTATION_CHANNELS.includes(channel)) continue;
      if (raw === null || raw === undefined || raw === '') delete next[channel];
      else {
        const value = String(raw).trim().toLowerCase();
        if (!/^[a-z0-9][a-z0-9._:-]{0,79}$/.test(value)) throw new Error('Invalid presentation state value');
        next[channel] = value;
      }
    }
    if (Object.keys(next).length) current[id] = next;
    else delete current[id];
    const serialized = Object.keys(current).length ? JSON.stringify(current) : '';
    if (serialized === previous) return readPresentationState(target);
    if (serialized) target.setAttribute('data-exp-presentation-state', serialized);
    else target.removeAttribute('data-exp-presentation-state');
    const phase = pageObserverMarker()?.dataset.expPageObserverPhase || null;
    const detail = JSON.stringify({
      protocol: 'exp-presentation-state-v1',
      source: id,
      channels: Object.keys(next),
      phase,
      at: Date.now(),
    });
    target.dispatchEvent(new CustomEvent(PRESENTATION_STATE_EVENT, {
      bubbles: true,
      composed: true,
      detail,
    }));
    emitSuiteEvent(id, 'presentation.state-changed', { channels: Object.keys(next), phase });
    return readPresentationState(target);
  }

  function clearPresentationState(target, productId) {
    return setPresentationState(target, productId, Object.fromEntries(PRESENTATION_CHANNELS.map(channel => [channel, null])));
  }

  function presentationStateChain(target) {
    const chain = [];
    let node = target instanceof Element ? target : target?.parentElement;
    while (node instanceof Element) {
      const state = readPresentationState(node);
      if (Object.keys(state).length) chain.push(Object.freeze({ node, state }));
      node = node.parentElement;
    }
    return Object.freeze(chain);
  }

  function isPresentationSuppressed(target) {
    for (const entry of presentationStateChain(target)) {
      for (const state of Object.values(entry.state)) {
        if (state?.visibility === 'hide' || state?.visibility === 'collapse') return true;
      }
    }
    return false;
  }

  function pageObserverMarker() {
    return document.querySelector('meta[data-exp-page-observer]');
  }

  function ensureSharedPageObserver(owner = 'core', options = {}) {
    let marker = pageObserverMarker();
    if (marker) return Object.freeze({ leader: false, owner: marker.dataset.expPageObserver || 'unknown' });
    marker = document.createElement('meta');
    marker.dataset.expPageObserver = String(owner || 'core').toLowerCase();
    marker.dataset.expPageObserverProtocol = 'exp-page-observer-v1';
    marker.dataset.expPageObserverEpoch = '0';
    (document.documentElement || document.head || document.body)?.append(marker);

    const delay = Math.max(16, Math.min(500, Number(options.delayMs || 60) || 60));
    let timer = 0;
    let epoch = 0;
    const pending = new Map();
    const queue = (target, record) => {
      if (!(target instanceof Element)) return;
      if (target.closest?.('[data-exp-owned="1"]')) return;
      const state = pending.get(target) || { types: new Set(), added: 0, removed: 0 };
      state.types.add(record.type);
      state.added += record.addedNodes?.length || 0;
      state.removed += record.removedNodes?.length || 0;
      pending.set(target, state);
    };
    const flush = () => {
      timer = 0;
      const entries = [...pending.entries()].filter(([target]) => target.isConnected);
      pending.clear();
      if (!entries.length) return;
      epoch += 1;
      marker.dataset.expPageObserverEpoch = String(epoch);
      const payloads = entries.map(([target, state], index) => [target, JSON.stringify({
        protocol: 'exp-page-observer-v1',
        owner: marker.dataset.expPageObserver,
        epoch,
        rootIndex: index,
        rootCount: entries.length,
        types: [...state.types].sort(),
        added: state.added,
        removed: state.removed,
        href: location.href,
        at: Date.now(),
      })]);
      payloads.forEach(([target, payload]) => {
        target.dispatchEvent(new CustomEvent(PAGE_BATCH_EVENT, { bubbles: true, composed: true, detail: payload }));
      });
      for (const phase of Object.keys(PRESENTATION_PHASES).sort((left, right) => PRESENTATION_PHASES[left] - PRESENTATION_PHASES[right])) {
        marker.dataset.expPageObserverPhase = phase;
        for (const [target, payload] of payloads) {
          target.dispatchEvent(new CustomEvent(`${PAGE_PHASE_EVENT}:${phase}`, { bubbles: true, composed: true, detail: payload }));
        }
        document.dispatchEvent(new CustomEvent(`${PAGE_PHASE_END_EVENT}:${phase}`, {
          detail: JSON.stringify({
            protocol: 'exp-page-observer-v1',
            owner: marker.dataset.expPageObserver,
            epoch,
            phase,
            rootCount: entries.length,
            href: location.href,
            at: Date.now(),
          }),
        }));
        delete marker.dataset.expPageObserverPhase;
      }
    };
    const observer = new MutationObserver(records => {
      for (const record of records) {
        const target = record.target?.nodeType === Node.TEXT_NODE ? record.target.parentElement : record.target;
        queue(target, record);
      }
      if (!timer && pending.size) timer = setTimeout(flush, delay);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    return Object.freeze({ leader: true, owner: marker.dataset.expPageObserver });
  }

  function observePage(callback, options = {}) {
    if (typeof callback !== 'function') throw new TypeError('Page observer callback must be a function');
    ensureSharedPageObserver(options.productId || options.owner || 'core', options);
    const listener = event => {
      let payload;
      try { payload = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail; } catch { return; }
      if (!payload || payload.protocol !== 'exp-page-observer-v1') return;
      callback(payload, event.target instanceof Element ? event.target : document.documentElement);
    };
    document.addEventListener(PAGE_BATCH_EVENT, listener);
    return () => document.removeEventListener(PAGE_BATCH_EVENT, listener);
  }

  function observePageBatch(callback, options = {}) {
    if (typeof callback !== 'function') throw new TypeError('Page batch callback must be a function');
    const productId = String(options.productId || options.owner || 'core').toLowerCase();
    const contract = suiteContract(productId);
    const requested = options.phase || contract?.presentationPhases?.[0] || 'observe';
    const phase = normalizePresentationPhases([requested])[0] || 'observe';
    ensureSharedPageObserver(productId, options);
    const roots = new Map();
    const rootEvent = `${PAGE_PHASE_EVENT}:${phase}`;
    const endEvent = `${PAGE_PHASE_END_EVENT}:${phase}`;
    const onRoot = event => {
      let payload;
      try { payload = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail; } catch { return; }
      if (!payload || payload.protocol !== 'exp-page-observer-v1') return;
      const root = event.target instanceof Element ? event.target : null;
      if (root) roots.set(root, payload);
    };
    const onEnd = event => {
      let payload;
      try { payload = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail; } catch { return; }
      if (!payload || payload.protocol !== 'exp-page-observer-v1' || payload.phase !== phase) return;
      const entries = [...roots.entries()];
      roots.clear();
      callback(
        Object.freeze({ ...payload }),
        Object.freeze(entries.map(([root]) => root)),
        Object.freeze(entries.map(([, detail]) => Object.freeze({ ...detail }))),
      );
    };
    document.addEventListener(rootEvent, onRoot);
    document.addEventListener(endEvent, onEnd);
    return () => {
      document.removeEventListener(rootEvent, onRoot);
      document.removeEventListener(endEvent, onEnd);
      roots.clear();
    };
  }

  function observePresentationState(callback, options = {}) {
    if (typeof callback !== 'function') throw new TypeError('Presentation state callback must be a function');
    const source = options.source ? String(options.source).toLowerCase() : '';
    const channel = options.channel ? String(options.channel).toLowerCase() : '';
    const listener = event => {
      let payload;
      try { payload = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail; } catch { return; }
      if (!payload || payload.protocol !== 'exp-presentation-state-v1') return;
      if (source && payload.source !== source) return;
      if (channel && !payload.channels?.includes(channel)) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target) callback(Object.freeze({ ...payload }), target);
    };
    document.addEventListener(PRESENTATION_STATE_EVENT, listener);
    return () => document.removeEventListener(PRESENTATION_STATE_EVENT, listener);
  }

  function pageObserverState() {
    const marker = pageObserverMarker();
    return Object.freeze({
      active: Boolean(marker),
      owner: marker?.dataset.expPageObserver || null,
      protocol: marker?.dataset.expPageObserverProtocol || null,
      epoch: Number(marker?.dataset.expPageObserverEpoch || 0),
      phase: marker?.dataset.expPageObserverPhase || null,
    });
  }

  function registerDiagnosticsProduct(productId, productVersion, host) {
    const result = ExtraPotionsDiagnostics.registerProduct(productId, productVersion, host);
    if (result) result.dataset.expCoreVersion = version;
    const contract = suiteContract(productId);
    registerSuiteProduct({ productId, productVersion });
    if (contract?.presentationPhases?.length) registerPresentationProvider({ productId });
    return result;
  }
  function menuThemeOwner() {
    return [...document.querySelectorAll('[data-exp-product-launcher="1"][data-product-id]')]
      .filter(node => node.isConnected && THEME_PRIORITY[node.dataset.productId])
      .sort((a,b) => THEME_PRIORITY[b.dataset.productId] - THEME_PRIORITY[a.dataset.productId])[0] || null;
  }
  function menuPalette(host) {
    try {
      const value = JSON.parse(host.dataset.expMenuPalette || 'null');
      if (!value || !baseTokenNames.every(key => /^#[0-9a-f]{3,8}$/i.test(value[key]))) return null;
      if (value.skin && (/url\(|var\(|;|\/\*/i.test(value.skin) || value.skin.length > 300)) return null;
      return semanticTheme(value);
    } catch { return null; }
  }
  function publishMenuPalette(host, theme) {
    if (!host || !theme) return;
    const palette = Object.fromEntries([...tokenNames,'id','skin','skinVertical','skinMode'].map(key => [key, theme[key]]));
    const serialized = JSON.stringify(palette);
    if (host.dataset.expMenuPalette === serialized) return;
    host.dataset.expMenuPalette = serialized;
    emit('menu-theme', host.dataset.productId);
  }
  function injectStyle(shadow, css, data = {}) {
    const node = document.createElement('style');
    Object.assign(node.dataset, data);
    node.textContent = css;
    shadow.append(node);
    // Constructed sheets survive pages that block style elements. Keep the style
    // node as a fallback and as the editable public handle used by product code.
    let sheet;
    try { sheet = new CSSStyleSheet(); sheet.replaceSync(css); shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, sheet]; } catch {}
    const observe = new MutationObserver(() => { if (sheet) { try { sheet.replaceSync(node.textContent); } catch {} } });
    observe.observe(node, { childList: true, characterData: true, subtree: true });
    node.dispose = () => { observe.disconnect(); if (sheet) shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets].filter(s => s !== sheet); node.remove(); };
    return node;
  }
  function resolveShadowRoot(target) {
    if (target instanceof ShadowRoot) return target;
    if (target instanceof Element) {
      if (target.shadowRoot instanceof ShadowRoot) return target.shadowRoot;
      const root = target.getRootNode?.();
      if (root instanceof ShadowRoot) return root;
    }
    return null;
  }
  function applyMatteToggleChrome(target) {
    const shadow = resolveShadowRoot(target);
    if (!shadow) return false;
    if (shadow.querySelector('style[data-exp-matte-toggle-chrome]')) return true;
    injectStyle(shadow, MATTE_TOGGLE_CHROME_CSS, { expMatteToggleChrome: '1' });
    return true;
  }
  function applyTwoColumnSettingsGrid(container) {
    if (!(container instanceof HTMLElement)) return false;
    const root = resolveShadowRoot(container);
    if (root && !root.querySelector('style[data-exp-settings-grid]')) {
      injectStyle(root, '[data-exp-settings-grid="two-column"]{display:grid!important;grid-template-columns:minmax(0,1fr)!important;align-items:stretch!important;column-gap:0!important}[data-exp-settings-grid="two-column"]>*{grid-column:1/-1!important;min-width:0!important}[data-exp-settings-grid="two-column"]>[data-exp-grid-cell="compact"]{grid-column:1/-1!important}', { expSettingsGrid: '1' });
    }
    container.dataset.expSettingsGrid = 'two-column';
    if (root) applyMatteToggleChrome(root);
    return true;
  }
  function applyContentDrivenMenuLayout(shadow) {
    if (!(shadow instanceof ShadowRoot)) return false;
    shadow.host.dataset.expContentDrivenMenu = '1';
    if (!shadow.querySelector('style[data-exp-content-driven-menu]')) {
      injectStyle(shadow, '.fl-tool-body .action.warn{border-color:#cb6868!important;background:#402020!important;color:#ffd7d7!important}.fl-tool-body .action.warn:hover{background:#582828!important;color:#fff!important}:host([data-exp-content-driven-menu="1"]) :is(.panel,#mb-dock,[data-exp-part="dock"]){height:auto!important;min-height:0!important}:host([data-exp-content-driven-menu="1"]) :is(.fl-tool-body,.panel-body,.route-body){height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}:host([data-exp-content-driven-menu="1"]) :is(.fl-tool-header,.panel-head,.route,.nav-item,.group>summary){height:auto!important;min-height:0!important;white-space:normal!important}:host([data-exp-content-driven-menu="1"]) :is(.fl-tool-title,.label,.setting-label,.setting-value,.copy strong,.copy .label){overflow:visible!important;text-overflow:clip!important;white-space:normal!important;word-break:normal!important;overflow-wrap:anywhere!important}:host([data-exp-content-driven-menu="1"]) :is(.row,.mini-row,.setting-row){height:auto!important;min-height:0!important;align-items:center!important}:host([data-exp-content-driven-menu="1"]) :is(.group,.section,.panel-body:not(.hidden)){grid-template-columns:minmax(0,1fr)!important}:host([data-exp-content-driven-menu="1"]) :is(.group,.section,.panel-body:not(.hidden))>*{grid-column:1/-1!important}.fl-tool-body .row:has(>select){display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr)!important;min-width:0!important}.fl-tool-body .row>select{width:100%!important;min-width:0!important;max-width:100%!important}', { expContentDrivenMenu: '1' });
    }
    applyMatteToggleChrome(shadow);
    return true;
  }
  function layoutGrid() {
    const order = read(GRID_ORDER, []);
    const sorted = [...document.querySelectorAll('[data-exp-product-launcher="1"]')].sort((a,b) => {
      const ai = Array.isArray(order) ? order.indexOf(a.dataset.productId) : -1;
      const bi = Array.isArray(order) ? order.indexOf(b.dataset.productId) : -1;
      if (ai !== bi) return ai < 0 ? 1 : bi < 0 ? -1 : ai - bi;
      const ap = Number(a.dataset.launcherPriority || 0);
      const bp = Number(b.dataset.launcherPriority || 0);
      return bp - ap || a.dataset.productId.localeCompare(b.dataset.productId);
    });
    const assign = (node, slot, span = 1) => {
      const row = Math.floor(slot / 3), column = slot % 3;
      Object.assign(node.dataset, { launcherSlot:String(slot), launcherRow:String(row), launcherColumn:String(column), launcherSpan:String(span) });
      node.style.setProperty('--exp-launcher-x', column * 56 + 'px');
      node.style.setProperty('--exp-launcher-y', row * 56 + 'px');
      node.style.setProperty('--exp-launcher-offset', row * 56 + 'px');
    };
    sorted.forEach((node, index) => assign(node, index));
    write(GRID_ORDER, sorted.map(node => node.dataset.productId));
  }
  function storageRead(key, fallback = null) {
    try { if (typeof GM_getValue === 'function') return GM_getValue(key, fallback); } catch {}
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function storageWrite(key, value) {
    try { if (typeof GM_setValue === 'function') { GM_setValue(key, value); return; } } catch {}
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
  function claimNotice(productId, changeId) {
    const key = `exp:v3:${String(productId || 'product')}:notice:${String(changeId || 'change')}`;
    if (storageRead(key, false) === true) return false;
    storageWrite(key, true);
    return true;
  }
  function consumeVersionChange(productId, currentVersion, legacyKey = '') {
    const key = `exp:v3:${String(productId || 'product')}:installed-version`;
    let previous = String(storageRead(key, '') || '');
    if (!previous && legacyKey) { try { previous = String(localStorage.getItem(legacyKey) || ''); } catch {} }
    storageWrite(key, String(currentVersion || ''));
    return previous && previous !== currentVersion && claimNotice(productId, `updated:${currentVersion}`) ? previous : '';
  }
  function visibleFloatingNotices() {
    return [...document.querySelectorAll('[data-exp-product-launcher="1"][data-product-id]')]
      .flatMap(host => [...(host.shadowRoot?.querySelectorAll('[data-exp-floating-notice="1"]') || [])].map(notice => ({ host, notice })))
      .filter(({ notice }) => !notice.hidden && notice.getClientRects().length)
      .sort((a,b) => Number(a.host.dataset.launcherSlot || 0) - Number(b.host.dataset.launcherSlot || 0) || a.host.dataset.productId.localeCompare(b.host.dataset.productId));
  }
  function layoutFloatingNotices() {
    const launchers = [...document.querySelectorAll('[data-exp-product-launcher="1"][data-product-id]')]
      .map(host => host.shadowRoot?.querySelector('[data-exp-part="launcher"]'))
      .filter(Boolean).map(node => node.getBoundingClientRect()).filter(box => box.width && box.height);
    const notices = visibleFloatingNotices();
    if (!launchers.length || !notices.length) return;
    const anchor = document.documentElement.dataset.expLauncherAnchor === 'top' ? 'top' : 'bottom';
    const gridTop = Math.min(...launchers.map(box => box.top));
    const gridBottom = Math.max(...launchers.map(box => box.bottom));
    const gridRight = Math.max(...launchers.map(box => box.right));
    let cursor = anchor === 'top' ? gridBottom + 8 : gridTop - 8;
    for (const { notice } of notices) {
      const width = Math.min(notice.offsetWidth || notice.scrollWidth || 260, Math.max(0, innerWidth - 24));
      const height = notice.offsetHeight || notice.scrollHeight || 72;
      const top = anchor === 'top' ? cursor : cursor - height;
      notice.style.setProperty('width', `${width}px`, 'important');
      notice.style.setProperty('left', `${Math.max(8, Math.min(innerWidth - width - 8, gridRight - width))}px`, 'important');
      notice.style.setProperty('right', 'auto', 'important');
      notice.style.setProperty('top', `${Math.max(8, Math.min(innerHeight - height - 8, top))}px`, 'important');
      notice.style.setProperty('bottom', 'auto', 'important');
      cursor = anchor === 'top' ? top + height + 8 : top - 8;
    }
  }
  function registerFloatingNotice(host, notice) {
    if (!(host instanceof Element) || !(notice instanceof Element)) return () => {};
    if (floatingNoticeRegistrations.has(notice)) return floatingNoticeRegistrations.get(notice);
    notice.dataset.expFloatingNotice = '1';
    const refresh = () => requestAnimationFrame(layoutFloatingNotices);
    const mutation = new MutationObserver(refresh); mutation.observe(notice, { attributes:true, attributeFilter:['hidden','class'] });
    const resize = new ResizeObserver(refresh); resize.observe(notice);
    addEventListener('resize', refresh, { passive:true }); document.addEventListener('exp-core:coordination', refresh);
    const dispose = () => { mutation.disconnect(); resize.disconnect(); removeEventListener('resize', refresh); document.removeEventListener('exp-core:coordination', refresh); floatingNoticeRegistrations.delete(notice); };
    floatingNoticeRegistrations.set(notice, dispose); refresh(); return dispose;
  }
  function registerLauncher(host, options = {}) {
    if (registrations.has(host)) return registrations.get(host);
    const id = options.productId || options.id || host.dataset.productId;
    const contract = suiteContract(id);
    const launcherPriority = contract ? contract.launcherPriority : options.priority ?? 0;
    Object.assign(host.dataset, { expProductLauncher:'1', productId:id, launcherPriority:String(launcherPriority) });
    applyMatteToggleChrome(host);
    // The launcher is non-modal: site-wide dialog backdrop styles must never
    // paint over the page when the reference opens its manual popover.
    const backdropStyle = host.shadowRoot ? injectStyle(host.shadowRoot,
      ':host::backdrop{all:initial!important;display:none!important;background:transparent!important;pointer-events:none!important}',
      { expLauncherBackdrop: '1' }) : null;
    const stopProtect = CoreFoundation.protectLauncherHost(host);
    let frame = 0;
    const refresh = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; layoutGrid(); controllers.get(host)?.layout(); }); };
    document.addEventListener('exp-core:coordination', refresh);
    addEventListener('resize', refresh);
    layoutGrid(); emit('launcher-added', id);
    const dispose = () => { stopProtect(); backdropStyle?.dispose(); cancelAnimationFrame(frame); document.removeEventListener('exp-core:coordination', refresh); removeEventListener('resize', refresh); delete host.dataset.expProductLauncher; registrations.delete(host); layoutGrid(); emit('launcher-removed', id); };
    registrations.set(host, dispose);
    return dispose;
  }
  function themes(productTheme) {
    const common = CoreFoundation.SHARED_UI_THEMES;
    return Object.freeze([...common, CoreFoundation.CRIMSON_THEME, ...(productTheme ? [productTheme] : [CoreFoundation.UI_THEMES.at(-1)])].map(t => { const theme = semanticTheme(t); return Object.freeze({ ...theme, vars: Object.fromEntries(tokenNames.map(k => [k, theme[k]])) }); }));
  }
  function createThemeSwatches({ container, themes: choices, value, onChange = () => {} }) {
    const root = resolveShadowRoot(container);
    if (root && !root.querySelector('style[data-exp-theme-swatches]')) {
      injectStyle(root, '.exp-theme-swatches{display:flex;align-items:center;gap:6px;min-height:28px;flex-wrap:wrap}.exp-theme-swatch{appearance:none;box-sizing:border-box!important;flex:0 0 22px!important;width:22px!important;height:22px!important;min-width:22px!important;min-height:22px!important;max-width:22px!important;max-height:22px!important;padding:0!important;border:2px solid var(--theme-line,var(--line,#41434d));border-radius:5px!important;cursor:pointer}.exp-theme-swatch:hover,.exp-theme-swatch:focus-visible{outline:2px solid var(--theme-accent,var(--accent,#8b5cf6));outline-offset:2px}.exp-theme-swatch.is-on{border-color:var(--theme-text,var(--text,#fff));box-shadow:0 0 0 2px var(--theme-accent,var(--accent,#8b5cf6))}', { expThemeSwatches: '1' });
      applyMatteToggleChrome(root);
    }
    container.classList.add('exp-theme-swatches'); container.setAttribute('role', 'radiogroup'); container.setAttribute('aria-label', 'Menu Theme');
    const buttons = choices.map(theme => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'exp-theme-swatch';
      for (const property of ['width','height','min-width','min-height','max-width','max-height']) button.style.setProperty(property, '22px', 'important');
      button.style.setProperty('border-radius', '5px', 'important');
      button.style.setProperty('padding', '0', 'important');
      button.style.setProperty('box-sizing', 'border-box', 'important');
      button.style.setProperty('flex', '0 0 22px', 'important');
      button.setAttribute('role', 'radio'); button.setAttribute('aria-label', theme.name); button.title = theme.name;
      button.dataset.theme = button.dataset.swatch = theme.id; button.style.background = theme.swatch;
      button.addEventListener('click', () => { paint(theme.id); onChange(theme.id); }); container.append(button); return button;
    });
    function paint(next) { value = next; buttons.forEach((b,i) => { const on = choices[i].id === value; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); b.setAttribute('aria-pressed', String(on)); b.tabIndex = on || !choices.some(t => t.id === value) && i === 0 ? 0 : -1; }); }
    const keyboard = event => { const current = buttons.indexOf(event.target); if (current < 0 || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length; buttons[next].click(); buttons[next].focus(); };
    container.addEventListener('keydown', keyboard); paint(value);
    return { setValue: paint, destroy() { container.removeEventListener('keydown', keyboard); buttons.forEach(b => b.remove()); } };
  }
  function focusMenuSurface(panel) { if (!(panel instanceof HTMLElement)) return false; panel.tabIndex = -1; panel.style.outline = 'none'; panel.focus({ preventScroll: true }); return true; }
  const FLOATING_NOTICE_CSS = '.exp-floating-update{position:fixed;z-index:2147483647;box-sizing:border-box;width:min(312px,calc(100vw - 24px));max-width:calc(100vw - 24px);margin:0;padding:10px 32px 10px 10px;border:1px solid var(--exp-notice-border,var(--dropper-accent,#6f42b4));border-radius:10px;background:linear-gradient(180deg,var(--exp-notice-top,#251a35),var(--exp-notice-bottom,#18181d) 70%);color:var(--exp-notice-text,#f4f4f6);box-shadow:0 10px 28px #0008;font:500 9px/1.45 system-ui,sans-serif}.exp-floating-update[hidden]{display:none!important}.exp-floating-update-dismiss{position:absolute;top:7px;right:7px;width:23px;height:23px;padding:0;border:1px solid transparent;border-radius:7px;background:transparent;color:inherit;cursor:pointer;font:15px/1 Arial,sans-serif}.exp-floating-update-dismiss:hover,.exp-floating-update-dismiss:focus-visible{border-color:var(--exp-notice-border,var(--dropper-accent,#6f42b4));outline:none}';
  function ensureFloatingNoticeStyle(shadow) {
    if (!shadow.querySelector('style[data-exp-floating-notice]')) {
      injectStyle(shadow, FLOATING_NOTICE_CSS, { expFloatingNotice: '1' });
    }
  }
  function syncNoticeTheme(notice, themeSource) {
    const theme = getComputedStyle(themeSource);
    const first = (names, fallback) => names.map(name => theme.getPropertyValue(name).trim()).find(Boolean) || fallback;
    notice.style.setProperty('--exp-notice-border', first(['--exp-notice-border','--theme-accent','--dropper-accent','--accent','--accent2','--teal','--mb-brand'], theme.borderTopColor || '#6f42b4'));
    notice.style.setProperty('--exp-notice-top', first(['--exp-notice-top','--theme-panel','--surface','--panel','--raised','--mb-surface','--bg','--mb-bg'], theme.backgroundColor || '#251a35'));
    notice.style.setProperty('--exp-notice-bottom', first(['--exp-notice-bottom','--theme-bg','--bg','--mb-bg','--surface','--mb-surface'], theme.backgroundColor || '#18181d'));
    notice.style.setProperty('--exp-notice-text', first(['--exp-notice-text','--theme-text','--text','--mb-ink'], theme.color || '#f4f4f6'));
  }
  function createFloatingNotice(options = {}) {
    const { shadow, panel, notice, versionButton = null } = options;
    const host = options.host || shadow?.host;
    if (!(shadow instanceof ShadowRoot) || !(panel instanceof Element) || !(notice instanceof Element)) return Object.freeze({ show() {}, hide() {}, toggle() {}, layout() {}, setMenuOpen() {}, destroy() {} });
    const durationMs = Math.max(0, Number(options.durationMs ?? 30000));
    const manageVersion = options.manageVersion !== false;
    let timer = 0, menuOpen = false, destroyed = false;
    ensureFloatingNoticeStyle(shadow);
    applyMatteToggleChrome(shadow);
    notice.classList.add('update-notice','exp-floating-update'); notice.setAttribute('role','status');
    let dismiss = notice.querySelector(':scope > .exp-floating-update-dismiss');
    if (!dismiss) { dismiss=document.createElement('button'); dismiss.type='button'; dismiss.className='exp-floating-update-dismiss'; dismiss.setAttribute('aria-label','Dismiss changelog'); dismiss.textContent='×'; notice.prepend(dismiss); }
    shadow.append(notice); const unregisterNotice = registerFloatingNotice(host, notice);
    const themeSource = options.themeSource instanceof Element ? options.themeSource : panel;
    const syncTheme = () => syncNoticeTheme(notice, themeSource);
    const clearTimer=()=>{clearTimeout(timer);timer=0;};
    function layout(){if(destroyed||notice.hidden)return;syncTheme();layoutFloatingNotices();}
    function hide(){clearTimer();notice.hidden=true;versionButton?.setAttribute('aria-expanded','false');layoutFloatingNotices();}
    function show(){notice.hidden=false;versionButton?.setAttribute('aria-expanded','true');clearTimer();if(durationMs)timer=setTimeout(hide,durationMs);requestAnimationFrame(layoutFloatingNotices);}
    function toggle(){if(notice.hidden)show();else hide();}
    function versionClick(){if(manageVersion)toggle();else if(!notice.hidden)show();}
    function setMenuOpen(value){menuOpen=Boolean(value);if(!menuOpen)hide();else requestAnimationFrame(layout);}
    const coordination=()=>requestAnimationFrame(layout);
    dismiss.addEventListener('click',hide);versionButton?.addEventListener('click',versionClick);addEventListener('resize',layout,{passive:true});document.addEventListener('exp-core:coordination',coordination);
    return Object.freeze({show,hide,toggle,layout,setMenuOpen,destroy(){destroyed=true;clearTimer();unregisterNotice();dismiss.removeEventListener('click',hide);versionButton?.removeEventListener('click',versionClick);removeEventListener('resize',layout);document.removeEventListener('exp-core:coordination',coordination);}});
  }
  // Core-owned update and changelog cards use the canonical menu-width notice
  // geometry. The legacy floating-notice coordinator remains exported
  // for compatibility, but it no longer owns these product notices.
  function createMenuNotice(options = {}) {
    const { shadow, panel, notice, versionButton = null } = options;
    const host = options.host || shadow?.host;
    if (!(shadow instanceof ShadowRoot) || !(panel instanceof Element) || !(notice instanceof Element)) {
      return Object.freeze({ show() {}, hide() {}, toggle() {}, layout() {}, setMenuOpen() {}, destroy() {} });
    }
    const durationMs = Math.max(0, Number(options.durationMs ?? 30000));
    const manageVersion = options.manageVersion !== false;
    let timer = 0, menuOpen = false, destroyed = false, frame = 0;

    ensureFloatingNoticeStyle(shadow);
    applyMatteToggleChrome(shadow);
    notice.classList.add('update-notice', 'exp-floating-update');
    notice.dataset.placement = 'menu';
    delete notice.dataset.expFloatingNotice;
    notice.setAttribute('role', 'status');

    let dismiss = notice.querySelector(':scope > .exp-floating-update-dismiss,.update-dismiss');
    if (!dismiss) {
      dismiss = document.createElement('button');
      dismiss.type = 'button';
      dismiss.className = 'exp-floating-update-dismiss';
      dismiss.setAttribute('aria-label', 'Dismiss changelog');
      dismiss.textContent = '×';
      notice.prepend(dismiss);
    }

    const themeSource = options.themeSource instanceof Element ? options.themeSource : panel;
    const syncTheme = () => syncNoticeTheme(notice, themeSource);
    function widthForMode() {
      return menuWidthForMode(host?.dataset.menuWidth || 'compact');
    }
    function clearTimer() { clearTimeout(timer); timer = 0; }
    function queueLayout() {
      if (destroyed || frame) return;
      frame = requestAnimationFrame(() => { frame = 0; layout(); });
    }
    function layout() {
      if (destroyed || notice.hidden) return;
      syncTheme();
      const width = Math.min(widthForMode(), Math.max(0, innerWidth - 24));
      notice.style.setProperty('width', width + 'px', 'important');

      const panelBox = menuOpen && !panel.hidden && panel.getClientRects().length ? panel.getBoundingClientRect() : null;
      const launcher = shadow.querySelector('[data-exp-part="launcher"]');
      const launcherBox = launcher?.getBoundingClientRect?.();
      const anchorBox = panelBox?.width && panelBox?.height ? panelBox : launcherBox;
      if (!anchorBox?.width || !anchorBox?.height) return;

      const height = notice.offsetHeight || notice.scrollHeight || 72;
      const anchor = document.documentElement.dataset.expLauncherAnchor === 'top' ? 'top' : 'bottom';
      let top;
      if (panelBox?.width && panelBox?.height) {
        const above = panelBox.top - height - 8;
        top = above >= 8 ? above : Math.min(innerHeight - height - 8, panelBox.bottom + 8);
      } else if (anchor === 'top') {
        top = Math.min(innerHeight - height - 8, anchorBox.bottom + 8);
      } else {
        top = Math.max(8, anchorBox.top - height - 8);
      }
      const left = Math.max(8, Math.min(innerWidth - width - 8, anchorBox.right - width));
      notice.style.setProperty('left', left + 'px', 'important');
      notice.style.setProperty('right', 'auto', 'important');
      notice.style.setProperty('top', Math.max(8, top) + 'px', 'important');
      notice.style.setProperty('bottom', 'auto', 'important');
    }
    function hide() {
      clearTimer();
      notice.hidden = true;
      versionButton?.setAttribute('aria-expanded', 'false');
    }
    function show() {
      notice.hidden = false;
      versionButton?.setAttribute('aria-expanded', 'true');
      clearTimer();
      if (durationMs) timer = setTimeout(hide, durationMs);
      queueLayout();
    }
    function toggle() { if (notice.hidden) show(); else hide(); }
    function versionClick() { if (manageVersion) toggle(); else if (!notice.hidden) show(); }
    function setMenuOpen(value) { menuOpen = Boolean(value); queueLayout(); }

    const resize = new ResizeObserver(queueLayout);
    resize.observe(panel);
    resize.observe(notice);
    const mutation = new MutationObserver(queueLayout);
    mutation.observe(notice, { attributes:true, attributeFilter:['hidden'], childList:true, subtree:true });
    const coordination = () => queueLayout();
    dismiss.addEventListener('click', hide);
    versionButton?.addEventListener('click', versionClick);
    addEventListener('resize', queueLayout, { passive:true });
    document.addEventListener('exp-core:coordination', coordination);

    return Object.freeze({
      show, hide, toggle, layout, setMenuOpen,
      destroy() {
        destroyed = true;
        cancelAnimationFrame(frame);
        clearTimer();
        resize.disconnect();
        mutation.disconnect();
        dismiss.removeEventListener('click', hide);
        versionButton?.removeEventListener('click', versionClick);
        removeEventListener('resize', queueLayout);
        document.removeEventListener('exp-core:coordination', coordination);
      },
    });
  }

  function applyTheme(host, value, choices) {
    const controller = controllers.get(host); if (!controller) return;
    controller.setTheme(value, choices);
  }
  function normalizeControls(panel) {
    panel.querySelectorAll('button[role="switch"],button.toggle').forEach(button => {
      button.classList.add('toggleSwitch'); button.setAttribute('role', 'switch');
      if (!button.hasAttribute('aria-checked')) button.setAttribute('aria-checked', 'false');
      const row = button.closest('.row,.mini-row,.fl-switch,.setting-row');
      if (row) { row.classList.add('fl-switch'); const label = row.querySelector('.label,.copy>strong,.row-copy>strong,.setting-label,span'); if (label) label.classList.add('fl-switch-text'); if (!button.hasAttribute('aria-label') && !button.hasAttribute('aria-labelledby')) button.setAttribute('aria-label', label?.textContent || row.textContent.trim()); }
    });
    panel.querySelectorAll('.row,.mini-row,.setting-row').forEach(row => { if (!row.classList.contains('fl-switch')) row.classList.add('mini-row'); });
    panel.querySelectorAll('select').forEach(node => node.classList.add('select-lite'));
    panel.querySelectorAll('button.action,button.secondary,button.primary,button.compact,.diagnostics-controls button,.button-grid button,.menu-footer button').forEach(node => { if (!node.dataset.expPart) node.classList.add('life-btn'); });
    panel.querySelectorAll('.route-body').forEach(body => body.classList.toggle('fl-tool-hidden', body.hidden));
    const active = panel.querySelector('.fl-tool-header[aria-expanded="true"]');
    panel.querySelectorAll('.fl-tool-header').forEach(header => { if (active) header.classList.toggle('last-opened', header === active); const chevron = header.querySelector('.fl-tool-chevron'); if (chevron) { const text = header.getAttribute('aria-expanded') === 'true' ? '▾' : '▸'; if (chevron.textContent !== text) chevron.textContent = text; } });
  }
  function normalizeHeader(panel) {
    const head = panel.querySelector('.menu-head,header,.head'); if (!head) return;
    head.classList.add('menu-head');
    const brand = head.querySelector('.header-brand,.identity,.brand'); if (!brand) return;
    brand.classList.add('header-brand');
    let icon = brand.firstElementChild;
    if (icon?.tagName === 'IMG' || icon?.tagName.toLowerCase() === 'svg') { const frame = document.createElement('div'); frame.className = 'header-icon'; icon.before(frame); frame.append(icon); icon.classList.add('menu-icon'); icon = frame; }
    if (icon) { icon.classList.add('header-icon'); icon.querySelector('img,svg')?.classList.add('menu-icon'); }
    const copy = brand.children[1]; if (copy) copy.classList.add('header-copy');
    const row = copy?.firstElementChild; row?.classList.add('header-title-row');
    const title = row?.querySelector('h1,h2,h3,strong,.menu-title'); if (title) title.dataset.expPart = 'title';
    const ver = head.querySelector('.version,.header-version,[id$="header-version"]'); if (ver) ver.dataset.expPart = 'version';
    const subtitle = copy?.querySelector('small,.subtitle,.menu-subtitle,[id$="subtitle"]'); if (subtitle) subtitle.dataset.expPart = 'subtitle';
    const close = head.querySelector('.close,.menu-close,[id$="rail-close"]'); if (close) close.dataset.expPart = 'close';
    panel.querySelector('.divider')?.classList.add('header-divider');
    for (const section of panel.querySelectorAll('nav>.tool-panel,nav>section')) {
      section.classList.add('fl-tool-panel'); const control = section.querySelector(':scope>button'); const body = section.querySelector(':scope>div'); if (!control || !body) continue;
      control.classList.add('fl-tool-header'); body.classList.add('fl-tool-body');
      if (!control.querySelector('.fl-tool-title')) { let title = control.querySelector('span:not(.chevron)'); if (!title) { title = document.createElement('span'); title.textContent = control.textContent; control.replaceChildren(title); } title.classList.add('fl-tool-title'); }
      let chevron = control.querySelector('.chevron,.fl-tool-chevron'); if (!chevron) { chevron = document.createElement('span'); chevron.textContent = '▸'; control.append(chevron); } chevron.classList.add('fl-tool-chevron');
    }
  }
  function makeLauncher(launcher, launcherSrc) {
    if (launcher.dataset.expCoreLauncher) return;
    const image = launcher.querySelector('img,.launcher-gem svg,.icon,svg:not(.launcher-ring):not(.ring)');
    if (!image) throw new Error('Core launcher requires the product launcher artwork');
    const mark = image.cloneNode(true); mark.removeAttribute('style'); mark.removeAttribute('id'); mark.setAttribute('class','icon launcher-icon');
    if (launcherSrc && mark.tagName === 'IMG') mark.src = launcherSrc;
    launcher.replaceChildren(mark); launcher.dataset.expCoreLauncher = '1'; launcher.dataset.expPart = 'launcher';
    launcher.removeAttribute('data-help');
  }
  function create(options) {
    const { id, host, shadow, launcher, panel, getSettings = () => ({}), setOpen, shortcutKey = '', productTheme, launcherSrc } = options;
    if (controllers.has(host)) return controllers.get(host);
    // All styling comes from the reference and the composition adapter. Remove
    // product copies and their constructed sheets before mounting the canonical UI.
    shadow.querySelectorAll('style').forEach(node => node.dispose ? node.dispose() : node.remove());
    try { shadow.adoptedStyleSheets = []; } catch {}
    const styles = injectStyle(shadow, canonicalCss + compositionCss, { expCoreStyle:version });
    const themeRoot = document.createElement('div'); themeRoot.className = 'exp-core-theme';
    [...shadow.childNodes].filter(node => node !== styles).forEach(node => themeRoot.append(node)); shadow.append(themeRoot);
    panel.dataset.expPart = 'dock'; panel.classList.add('exp-menu-surface'); makeLauncher(launcher,launcherSrc); normalizeHeader(panel); normalizeControls(panel);
    let defaultSupport = null;
    const header = panel.querySelector('.menu-head');
    if (header && !header.querySelector('.support-wrap') && options.supportUrl !== '') {
      defaultSupport = createSupportControl({url:options.supportUrl || SUPPORT_URL,label:'Support '+id.toUpperCase()});
      let actions = header.querySelector('.header-actions');
      if (!actions) { actions=document.createElement('div');actions.className='header-actions';const close=header.querySelector('[data-exp-part="close"]');if(close)actions.append(close);header.append(actions); }
      actions.prepend(defaultSupport.element);
    }
    applyContentDrivenMenuLayout(shadow);
    applyMatteToggleChrome(shadow);
    const versionButton=panel.querySelector('.version,[data-exp-part="version"]');
    const menuNotices=[...themeRoot.querySelectorAll('.update-notice,.changelog')].map(notice=>createMenuNotice({host,shadow,panel,notice,versionButton:notice.classList.contains('changelog')?versionButton:null,manageVersion:false,durationMs:30000}));
    if (launcherSrc) panel.querySelectorAll('.header-icon img').forEach(image => image.src = launcherSrc);
    host.dataset.coreVersion = version; host.dataset.coreSource = 'exp-core';
    let choices = themes(productTheme), selected = choices.at(-1), open = false, destroyed = false, timer = 0, deadline = 0, frame = 0;
    const removers = [];
    const on = (node,type,fn,opts) => { node.addEventListener(type,fn,opts); removers.push(() => node.removeEventListener(type,fn,opts)); };
    let localTheme = null;
    function paintTheme(theme) {
      selected = theme;
      for (const key of tokenNames) { themeRoot.style.setProperty('--theme-' + key, selected[key]); host.style.setProperty('--' + key, selected[key]); }
      themeRoot.style.setProperty('--theme-skin', selected.skin || selected.swatch || selected.accent);
      themeRoot.style.setProperty('--theme-skin-vertical', selected.skinVertical || selected.skin || selected.swatch || selected.accent);
      Object.assign(themeRoot.dataset, { uiTheme:selected.id, themeSkin:selected.skinMode === 'flat' ? 'flat' : 'gradient' });
      host.dataset.uiTheme = selected.id;
    }
    function syncThemeOwner() {
      const owner = menuThemeOwner();
      const deprioritized = Boolean(owner && owner !== host);
      host.dataset.expThemeDeprioritized = deprioritized ? '1' : '0';
      host.dataset.expThemeOwner = owner?.dataset.productId || id;
      paintTheme(deprioritized && menuPalette(owner) || localTheme);
    }
    function setTheme(value, supplied) {
      if (supplied) choices = supplied.map(t => semanticTheme({ ...t, ...t.vars, skin:t.skin || t.swatch, skinVertical:t.skinVertical || t.skin || t.swatch }));
      const alias = ({warm:'ember',discord:'glacier',pine:'verdant',obsidian:'contrast'})[value] || value;
      localTheme = choices.find(t => t.id === alias) || choices.at(-1);
      publishMenuPalette(host, localTheme);
      syncThemeOwner();
    }
    function clearTimer() { clearTimeout(timer); timer = 0; deadline = 0; }
    function scheduleDismiss() { clearTimer(); if (!open || getSettings().menuAutoClose === false) return; deadline = Date.now()+15000; timer = setTimeout(() => { if (open && Date.now() >= deadline) setOpen(false,false); },15020); }
    function layout() {
      if (destroyed || !launcher.isConnected) return;
      const state = getSettings(); const width = ['full','compact','narrow'].includes(state.menuWidth) ? state.menuWidth : 'compact';
      host.dataset.menuWidth = width; themeRoot.dataset.panelWidth = width;
      themeRoot.classList.toggle('reduce-motion', state.reduceMotion === true || state.reduceMotion === 'on' || state.reducedMotion === 'reduce' || (state.reduceMotion === 'system' || state.reducedMotion === 'system') && matchMedia('(prefers-reduced-motion:reduce)').matches);
      const opacityValue = Number(state.opacityPercent);
      const opacity = state.customOpacity ? (Number.isFinite(opacityValue) ? Math.max(40, Math.min(100, Math.round(opacityValue / 5) * 5)) : 85)/100 : 1;
      themeRoot.style.setProperty('--exp-ui-opacity',String(opacity));
      const offset = parseFloat(getComputedStyle(host).getPropertyValue('--exp-launcher-offset')) || 0;
      const x = parseFloat(getComputedStyle(host).getPropertyValue('--exp-launcher-x')) || 0;
      const delta = Math.max(8-(innerHeight-60), Math.min(4, Number(read(GRID_DELTA,0)) || 0));
      const origin = innerHeight-60+delta, anchor = origin <= (innerHeight-48)/2 ? 'top':'bottom';
      document.documentElement.dataset.expLauncherAnchor = anchor;
      let top = anchor === 'top' ? origin+offset : origin-offset;

      top = Math.max(8,Math.min(innerHeight-56,top));
      Object.assign(launcher.style,{top:top+'px',right:(12+x)+'px',bottom:'auto',left:'auto',zIndex:open?'2147483647':'2147483600'});
      panel.dataset.expMenuWidth = width;
      const maxWidth = Math.max(0,innerWidth-24), panelWidth = Math.min(menuWidthForMode(width),maxWidth);
      Object.assign(panel.style,{width:panelWidth+'px',maxHeight:Math.max(0,innerHeight-80)+'px',overflowY:'auto',overflowX:'hidden',overscrollBehavior:'contain',right:'12px',left:'auto',bottom:'auto',zIndex:open?'2147483647':'2147483599'});
      if (!open) return;
      const h = panel.offsetHeight, below = innerHeight-top-56, above = top-8;
      const up = below < h+12 && above >= below;
      host.dataset.openDirection = up?'up':'down';
      panel.style.top = Math.max(8, up ? top-h-8 : Math.min(innerHeight-h-8,top+56))+'px';
      menuNotices.forEach(notice=>notice.layout());
    }
    const arrangement = ExpMenuArrangement.mount({ panel, id, onChange: queueLayout, resetLaunchers() { write(GRID_ORDER,[]);write(GRID_DELTA,0);layoutGrid();emit('launcher-grid-moved',id);queueLayout(); } });
    function queueLayout() { if (!frame && !destroyed) frame = requestAnimationFrame(() => { frame = 0; normalizeControls(panel); arrangement.update(); layout(); }); }
    let startX=0,startY=0,pointer=null,dragged=false,axis='',order=[];
    launcher.title = launcher.title || 'Drag left, right, up, or down to reorder. Alt+Arrow keys also reorder.';
    on(launcher,'pointerdown',e=>{if(e.button!==0)return;pointer=e.pointerId;startX=e.clientX;startY=e.clientY;order=read(GRID_ORDER,[]);if(!Array.isArray(order))order=[];if(!order.includes(id))order.push(id);dragged=false;axis='';e.preventDefault();});
    on(document,'pointermove',e=>{if(e.pointerId!==pointer)return;const dx=e.clientX-startX,dy=e.clientY-startY;if(!axis&&Math.max(Math.abs(dx),Math.abs(dy))>4)axis='order';if(!axis)return;dragged=true;e.preventDefault();launcher.classList.add('is-dragging');const from=order.indexOf(id),offset=Math.abs(dx)>Math.abs(dy)?Math.round(-dx/56):Math.round(dy/56)*3,to=Math.max(0,Math.min(order.length-1,from+offset)),next=[...order];next.splice(from,1);next.splice(to,0,id);write(GRID_ORDER,next);layoutGrid();emit('launcher-grid-moved',id);layout();},{passive:false});
    const end=e=>{if(e.pointerId===pointer){pointer=null;launcher.classList.remove('is-dragging');}};
    on(document,'pointerup',end);on(document,'pointercancel',end);
    on(launcher,'click',e=>{if(dragged){e.preventDefault();e.stopImmediatePropagation();dragged=false;}},true);
    on(launcher,'keydown',e=>{if(!e.altKey||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();let next=read(GRID_ORDER,[]);if(!Array.isArray(next))next=[];if(!next.includes(id))next.push(id);const from=next.indexOf(id),offset={ArrowLeft:1,ArrowRight:-1,ArrowUp:-3,ArrowDown:3}[e.key],to=Math.max(0,Math.min(next.length-1,from+offset));next=[...next];next.splice(from,1);next.splice(to,0,id);write(GRID_ORDER,next);layoutGrid();emit('launcher-grid-moved',id);layout();launcher.focus();});
    for(const type of ['pointerdown','click','wheel','keydown','input','change'])on(panel,type,scheduleDismiss,{passive:type==='wheel'});
    on(window,'keydown',e=>{if(shortcutKey&&e.altKey&&e.shiftKey&&e.key.toLowerCase()===shortcutKey.toLowerCase()&&!e.repeat){e.preventDefault();setOpen(!open,true);} });
    on(window,'resize',queueLayout);on(document,'exp-core:coordination',queueLayout);
    on(document,'exp-core:coordination',syncThemeOwner);
    on(document,'exp-core:menu-open',()=>{if(open && document.documentElement.getAttribute('data-exp-open-menu')!==id)setOpen(false,false);});
    const resize = new ResizeObserver(queueLayout); resize.observe(panel);
    const mutation = new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||r.attributeName==='hidden'))queueLayout();}); mutation.observe(panel,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
    const controller = {
      layout, setTheme,
      state(value) {open=Boolean(value);if(open){document.documentElement.setAttribute('data-exp-open-menu',id);document.dispatchEvent(new Event('exp-core:menu-open'));}panel.classList.toggle('fl-rail-open',open);menuNotices.forEach(notice=>notice.setMenuOpen(open));if(open)scheduleDismiss();else clearTimer();queueLayout();},
      update(){normalizeControls(panel);queueLayout();},
      get dismissAt(){return deadline;},
      destroy(){destroyed=true;arrangement.destroy();defaultSupport?.destroy();clearTimer();cancelAnimationFrame(frame);resize.disconnect();mutation.disconnect();menuNotices.forEach(notice=>notice.destroy());removers.forEach(f=>f());styles.dispose();controllers.delete(host);}
    };
    controllers.set(host,controller);setTheme(getSettings().uiTheme || getSettings().theme || id);
    queueLayout();return controller;
  }
  function createReleaseUpdateChecker(options = {}) {
    const productId = String(options.productId || '').toLowerCase();
    const repository = String(options.repository || '');
    const resolveCurrentVersion = typeof options.currentVersion === 'function'
      ? () => String(options.currentVersion() || '')
      : () => String(options.currentVersion || '');
    const enabled = typeof options.enabled === 'function' ? options.enabled : () => true;
    const onError = typeof options.onError === 'function' ? options.onError : () => {};
    if (!productId || !repository) throw new Error('Incomplete update checker configuration');
    function getCurrentVersion() {
      const currentVersion = resolveCurrentVersion();
      if (!currentVersion) throw new Error('Update checker current version unavailable');
      return currentVersion;
    }

    const ENDPOINT = String(options.endpoint || ('https://api.github.com/repos/' + repository + '/releases/latest'));
    const CACHE_KEY = 'exp:v3:' + productId + ':update-cache';
    const CHECK_INTERVAL = 15 * 60 * 1000;
    const CHECK_LEASE = 30 * 1000;
    let memory = {};

    function readState() {
      try {
        if (typeof GM_getValue === 'function') {
          const value = GM_getValue(CACHE_KEY, null);
          if (value && typeof value === 'object' && !Array.isArray(value)) return { ...value };
        }
      } catch {}
      try {
        const value = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        if (value && typeof value === 'object' && !Array.isArray(value)) return { ...value };
      } catch {}
      return { ...memory };
    }
    function writeState(value) {
      memory = { ...(value || {}) };
      try { if (typeof GM_setValue === 'function') GM_setValue(CACHE_KEY, memory); } catch {}
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(memory)); } catch {}
    }
    function releaseDetails(body) {
      const details = [];
      let section = false;
      for (const line of String(body || '').split(/\r?\n/)) {
        if (/^##\s+/.test(line)) { if (section) break; section = true; continue; }
        if (!section) continue;
        const match = line.match(/^\s*[-*]\s+(.+)/);
        if (!match) continue;
        const detail = match[1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[`*_]/g, '').trim();
        if (detail) details.push(detail.slice(0, 220));
        if (details.length === 4) break;
      }
      return details;
    }
    function normalize(state) {
      const next = { ...(state || {}) };
      if (!Object.hasOwn(next, 'lastCheckAt') && next.checkedAt) next.lastCheckAt = Number(next.checkedAt) || 0;
      if (!Object.hasOwn(next, 'lastRemoteVersion') && next.latest) next.lastRemoteVersion = String(next.latest || '');
      if (!Array.isArray(next.details)) next.details = [];
      return next;
    }
    function snapshot(state, stateName) {
      const currentVersion = getCurrentVersion();
      const next = normalize(state);
      const latest = String(next.lastRemoteVersion || '');
      return {
        checkedAt: Number(next.lastCheckAt || 0),
        latest: latest || null,
        state: stateName || next.state || 'idle',
        current: currentVersion,
        available: Boolean(latest && CoreFoundation.compareVersions(latest, currentVersion) > 0),
        details: next.details.slice(0, 4),
        checkedForVersion: next.checkedForVersion || null,
        lastRemoteVersion: latest || null,
        lastHttpStatus: Number(next.lastHttpStatus || 0),
        lastError: String(next.lastError || ''),
      };
    }
    function request() {
      return new Promise((resolve, reject) => {
        if (typeof GM_xmlhttpRequest !== 'function') return reject(Object.assign(new Error('Update request capability unavailable'), { code:'UPDATE_CAPABILITY' }));
        GM_xmlhttpRequest({
          method:'GET',
          url:ENDPOINT,
          timeout:10000,
          headers:{ Accept:'application/vnd.github+json', 'Cache-Control':'no-cache', Pragma:'no-cache' },
          onload(response) {
            if (response.status >= 200 && response.status < 300) return resolve(response);
            reject(Object.assign(new Error('Update metadata request failed'), { code:'UPDATE_HTTP_' + response.status, status:response.status }));
          },
          onerror:() => reject(Object.assign(new Error('Update metadata request failed'), { code:'UPDATE_NETWORK' })),
          ontimeout:() => reject(Object.assign(new Error('Update metadata request timed out'), { code:'UPDATE_TIMEOUT' })),
        });
      });
    }
    async function check(force = false) {
      const currentVersion = getCurrentVersion();
      let state = normalize(readState());
      if (!enabled() && !force) return snapshot(state, 'disabled');

      const now = Date.now();
      const checkedForCurrentVersion = state.checkedForVersion === currentVersion;
      if (!checkedForCurrentVersion) {
        state.checkedForVersion = currentVersion;
        state.lastCheckAt = 0;
        state.checkLeaseUntil = 0;
        state.lastRemoteVersion = '';
        state.lastHttpStatus = 0;
        state.lastError = '';
        state.details = [];
        state.availableVersion = '';
        state.availableAt = 0;
      }
      writeState(state);

      if (!force && Number(state.checkLeaseUntil || 0) > now) return snapshot(state, 'checking');
      if (!force && checkedForCurrentVersion && now - Number(state.lastCheckAt || 0) < CHECK_INTERVAL) return snapshot(state, 'cached');

      state.checkedForVersion = currentVersion;
      state.lastCheckAt = now;
      state.checkLeaseUntil = now + CHECK_LEASE;
      state.lastError = '';
      state.state = 'checking';
      writeState(state);

      try {
        const response = await request();
        const payload = JSON.parse(String(response.responseText || '{}'));
        const latest = String(payload.tag_name || '').replace(/^v/, '');
        if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(latest)) throw Object.assign(new Error('Invalid update metadata'), { code:'UPDATE_METADATA' });

        state = normalize(readState());
        state.checkedForVersion = currentVersion;
        state.lastCheckAt = Date.now();
        state.checkLeaseUntil = 0;
        state.lastRemoteVersion = latest;
        state.lastHttpStatus = Number(response.status || 0);
        state.lastError = '';
        state.details = releaseDetails(payload.body);
        state.state = 'checked';
        if (CoreFoundation.compareVersions(latest, currentVersion) > 0) {
          state.availableVersion = latest;
          state.availableAt = Date.now();
        } else {
          state.availableVersion = '';
          state.availableAt = 0;
        }
        writeState(state);
        return snapshot(state, 'checked');
      } catch (error) {
        state = normalize(readState());
        state.checkedForVersion = currentVersion;
        state.lastCheckAt = Date.now();
        state.checkLeaseUntil = 0;
        state.lastError = String(error?.message || 'Update check failed');
        state.state = 'failed';
        writeState(state);
        try { onError(error); } catch {}
        return snapshot(state, 'failed');
      }
    }
    function status() { return snapshot(readState()); }
    return Object.freeze({
      get CURRENT_VERSION() { return getCurrentVersion(); },
      ENDPOINT,
      CHECK_INTERVAL,
      check,
      status,
      compare: CoreFoundation.compareVersions,
    });
  }

  function createSupportControl({ url, label = 'Support' } = {}) {
    if (!url) return null;
    const wrapper = document.createElement('div');
    wrapper.className = 'support-wrap';
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'exp-support-button';
    button.className = 'support-button';
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'exp-support-popover');
    button.title = label;
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.2-4.35-9.55-8.45C.42 9.02 2.3 5 6.25 5c2.15 0 3.56 1.21 4.33 2.3C11.36 6.21 12.77 5 14.92 5c3.95 0 5.83 4.02 3.8 7.55C16.36 16.65 12 21 12 21Z"/></svg>';
    const popover = document.createElement('div');
    popover.id = 'exp-support-popover';
    popover.className = 'support-popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-label', label);
    popover.hidden = true;
    const strong = document.createElement('strong');
    strong.textContent = label;
    const copy = document.createElement('span');
    copy.textContent = 'Donations are optional. All features stay free.';
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = 'Open Ko-fi';
    popover.append(strong, copy, anchor, ExtraPotionsTools.createBitcoinDonation());
    wrapper.append(button, popover);
    const toggle = event => {
      event?.stopPropagation?.();
      ExtraPotionsTools.placeDonationPanel(popover,button);
      popover.hidden = !popover.hidden;
      button.setAttribute('aria-expanded', String(!popover.hidden));
    };
    const outside = event => {
      if (popover.hidden || event.composedPath().includes(wrapper) || event.composedPath().includes(popover)) return;
      popover.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    };
    button.addEventListener('click', toggle);
    document.addEventListener('pointerdown', outside, true);
    return Object.freeze({
      element: wrapper,
      button,
      popover,
      hide() { popover.hidden = true; button.setAttribute('aria-expanded', 'false'); },
      destroy() { button.removeEventListener('click', toggle); document.removeEventListener('pointerdown', outside, true); popover.remove(); wrapper.remove(); },
    });
  }

  function createProductNotice(options = {}) {
    const { host, shadow, panel, versionButton = null } = options;
    if (!(host instanceof Element) || !(shadow instanceof ShadowRoot) || !(panel instanceof Element)) {
      throw new Error('Product notice requires a mounted Core product');
    }
    const notice = document.createElement('div');
    notice.className = 'update-notice';
    notice.dataset.expUpdateNotice = '1';
    notice.hidden = true;
    notice.innerHTML = '<button type="button" class="update-dismiss" aria-label="Dismiss Update Notice">×</button><div class="update-head"><div class="update-heading"><div class="update-kicker">What\'s New</div><div class="update-title"></div></div><div class="update-version"></div></div><div class="update-text"></div><ul class="update-list"></ul><div class="update-footer"><a class="update-release" target="_blank" rel="noopener noreferrer">GitHub Release</a><a class="update-action" target="_blank" rel="noopener noreferrer">Install Update</a></div>';
    (shadow.querySelector('.exp-core-theme') || shadow).append(notice);
    const controller = createMenuNotice({
      host,
      shadow,
      panel,
      notice,
      versionButton: null,
      manageVersion: false,
      durationMs: options.durationMs ?? 30000,
    });
    function show(state = {}) {
      notice.querySelector('.update-kicker').textContent = state.kicker || "What's New";
      notice.querySelector('.update-title').textContent = state.title || '';
      notice.querySelector('.update-version').textContent = state.version ? 'v' + state.version : '';
      notice.querySelector('.update-text').textContent = state.text || '';
      const list = notice.querySelector('.update-list');
      list.replaceChildren();
      const details = Array.isArray(state.details) ? state.details.slice(0, 4) : [];
      for (const detail of details) {
        const item = document.createElement('li');
        item.textContent = detail;
        list.append(item);
      }
      list.hidden = !details.length;
      const release = notice.querySelector('.update-release');
      const releaseUrl = state.releaseUrl || options.releaseUrl || '';
      release.hidden = !releaseUrl;
      if (releaseUrl) release.href = releaseUrl;
      const action = notice.querySelector('.update-action');
      const actionUrl = state.actionUrl || options.installUrl || '';
      action.hidden = !actionUrl || state.showAction === false;
      if (actionUrl) action.href = actionUrl;
      action.textContent = state.actionText || 'Install Update';
      notice.dataset.noticeKind = state.kind || 'current';
      controller.setMenuOpen(!panel.hidden);
      controller.show();
    }
    const versionClick = () => {
      if (typeof options.onVersion === 'function') options.onVersion();
      else controller.toggle();
    };
    versionButton?.addEventListener('click', versionClick);
    return Object.freeze({
      element: notice,
      show,
      hide: controller.hide,
      toggle: controller.toggle,
      layout: controller.layout,
      setMenuOpen: controller.setMenuOpen,
      destroy() {
        versionButton?.removeEventListener('click', versionClick);
        controller.destroy();
        notice.remove();
      },
    });
  }

  function productCompatibilityReport() {
    const base = ExtraPotionsDiagnostics.compatibility();
    const interoperability = suiteHealth();
    const conflicts = [
      ...(Array.isArray(base.conflicts) ? base.conflicts : []),
      ...interoperability.conflicts,
    ];
    return Object.freeze({
      ...base,
      conflicts: Object.freeze(conflicts.map(conflict => Object.freeze({ ...conflict }))),
      status: conflicts.length ? 'conflicts-detected' : 'no-conflicts-observed',
      interoperability,
    });
  }

  function createSuiteCompatibilityControls() {
    const details = document.createElement('details');
    details.className = 'exp-tools-card';
    details.style.cssText = 'border:1px solid var(--theme-line,var(--line,#777));border-radius:7px;padding:7px;margin-top:8px';
    const summary = document.createElement('summary');
    summary.textContent = 'Product compatibility';
    const output = document.createElement('div');
    output.setAttribute('aria-live', 'polite');
    const refreshButton = document.createElement('button');
    refreshButton.type = 'button';
    refreshButton.className = 'life-btn action';
    refreshButton.textContent = 'Refresh compatibility';

    const refresh = () => {
      output.replaceChildren();
      const report = productCompatibilityReport();
      const suite = suiteSnapshot();
      const healthById = new Map(report.interoperability.products.map(product => [product.id, product]));
      if (!suite.products.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No ExtraPotions products are registered on this page yet.';
        output.append(empty);
      }
      for (const product of suite.products) {
        const health = healthById.get(product.id);
        const line = document.createElement('p');
        const stateAge = health?.stateAgeMs == null ? '' : ` · state ${Math.max(0, Math.round(health.stateAgeMs / 1000))}s ago`;
        line.textContent = `${product.id.toUpperCase()} ${product.version} · Core ${product.coreVersion} · ${health?.status === 'healthy' ? 'Healthy' : 'Check compatibility'}${stateAge}`;
        output.append(line);
      }

      const observers = document.createElement('p');
      const page = pageObserverState();
      const navigation = navigationObserverState();
      observers.textContent = `Shared observers · DOM: ${page.active ? page.owner || 'active' : 'idle'} · Navigation: ${navigation.active ? navigation.owner || 'active' : 'idle'}`;
      output.append(observers);

      const status = document.createElement('p');
      status.textContent = report.conflicts.length
        ? report.conflicts.map(conflict => conflict.type).join(', ')
        : 'No interoperability conflicts detected on this page.';
      output.append(status);

      const note = document.createElement('small');
      note.textContent = 'Only products running on this page are shown. Shared suite state is advisory coordination data, not an authorization signal.';
      output.append(note);
    };

    details.addEventListener('toggle', () => { if (details.open) refresh(); });
    refreshButton.addEventListener('click', refresh);
    details.append(summary, output, refreshButton);
    return details;
  }

  function createDiagnosticsReport(product, details = {}) {
    const report = ExtraPotionsDiagnostics.createReport(product, details, { version, source: 'exp-core', sourceVersion });
    return {
      ...report,
      interoperability: {
        suite: suiteSnapshot(),
        presentation: {
          phases: { ...PRESENTATION_PHASES },
          providers: presentationProviders(),
        },
        pageObserver: pageObserverState(),
        navigationObserver: navigationObserverState(),
        states: suiteStateSnapshot(),
        health: suiteHealth(),
      },
    };
  }
  function downloadDiagnostics(report) {
    const name=`${String(report.report||'Diagnostics').toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
    const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return; } catch {}
    const area=document.createElement('textarea');area.value=text;area.style.cssText='position:fixed;left:-9999px';document.documentElement.append(area);area.select();const success=document.execCommand('copy');area.remove();if(!success)throw new Error('Clipboard unavailable');
  }
  function createDiagnosticsControls(getReport, notify = () => {}) { return ExtraPotionsDiagnostics.createControls(getReport, notify); }
  function createProduct({id,name,version:productVersion,subtitle='',artwork,theme,sections=[],getSettings,onSettings=()=>{},priority,supportUrl=SUPPORT_URL}) {
    const host=document.createElement('div');host.id='exp-'+id+'-root';host.dataset.expOwned='1';const shadow=host.attachShadow({mode:'open'});const panel=document.createElement('aside');panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label',name+' settings');
    const header=document.createElement('header');header.className='menu-head';const brand=document.createElement('div');brand.className='header-brand';const image=document.createElement('img');image.src=artwork;image.alt='';const copy=document.createElement('div');const titleRow=document.createElement('div');const title=document.createElement('strong');title.textContent=name;const v=document.createElement('button');v.type='button';v.className='version';v.textContent='v'+productVersion;titleRow.append(title,v);const sub=document.createElement('small');sub.textContent=subtitle;copy.append(titleRow,sub);brand.append(image,copy);const close=document.createElement('button');close.className='close';close.textContent='×';close.setAttribute('aria-label','Close '+name);const actions=document.createElement('div');actions.className='header-actions';const support=createSupportControl({url:supportUrl,label:'Support '+name});if(support)actions.append(support.element);actions.append(close);header.append(brand,actions);const divider=document.createElement('div');divider.className='header-divider';const nav=document.createElement('nav');
    let isOpen=false, activeId='';let chrome;
    const sectionMap=new Map();
    function renderSection(section,body){const content=section.render({core:api,onSettings});replaceMenuContent(body,content);chrome?.update();}
    function renderActive(){if(!activeId)return false;const entry=sectionMap.get(activeId);if(!entry||entry.body.hidden)return false;renderSection(entry.section,entry.body);return true;}
    function setOpen(value,focus=true){isOpen=Boolean(value);panel.hidden=!isOpen;launcher.setAttribute('aria-expanded',String(isOpen));if(isOpen){activeId='';nav.querySelectorAll('.route-body').forEach(n=>n.hidden=true);nav.querySelectorAll('button[data-section]').forEach(n=>n.setAttribute('aria-expanded','false'));}chrome.state(isOpen);if(focus)(isOpen?focusMenuSurface(panel):launcher.focus());}
    for(const section of sections){const group=document.createElement('section');group.className='tool-panel';const button=document.createElement('button');button.type='button';button.textContent=section.label;button.dataset.section=section.id;const body=document.createElement('div');body.className='route-body';body.hidden=true;sectionMap.set(section.id,{section,body,button});button.addEventListener('click',()=>{const opening=body.hidden;nav.querySelectorAll('.route-body').forEach(n=>n.hidden=true);nav.querySelectorAll('button[data-section]').forEach(n=>{n.classList.toggle('last-opened',n===button);n.setAttribute('aria-expanded',String(opening&&n===button));});body.hidden=!opening;activeId=opening?section.id:'';if(opening)renderSection(section,body);chrome.update();});group.append(button,body);nav.append(group);}
    const launcher=document.createElement('button');launcher.className='launcher';launcher.type='button';launcher.setAttribute('aria-label','Open '+name);const mark=image.cloneNode(true);launcher.append(mark);launcher.addEventListener('click',()=>setOpen(!isOpen));close.addEventListener('click',()=>setOpen(false));panel.append(header,divider,nav);shadow.append(panel,launcher);document.documentElement.append(host);chrome=create({id,host,shadow,panel,launcher,getSettings,setOpen,productTheme:theme,supportUrl});const unregister=registerLauncher(host,{productId:id,priority});
    const key=e=>{if(e.key==='Escape'&&isOpen)setOpen(false);};document.addEventListener('keydown',key);
    return {host,shadow,panel,launcher,versionButton:v,open:()=>setOpen(true),close:()=>setOpen(false),toggle:()=>setOpen(!isOpen),refresh:()=>chrome.update(),renderActive,get isOpen(){return isOpen;},destroy(){document.removeEventListener('keydown',key);support?.destroy();chrome.destroy();unregister();host.remove();}};
  }
  let gridFrame=0;
  const scheduleGrid=()=>{if(!gridFrame)gridFrame=requestAnimationFrame(()=>{gridFrame=0;layoutGrid();});};
  const gridObserver=new MutationObserver(scheduleGrid);
  const startGrid=()=>{if(!document.documentElement)return;gridObserver.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-exp-product-launcher','data-product-id','data-launcher-priority','data-launcher-reserved-rows']});scheduleGrid();};
  if(document.documentElement)startGrid();else addEventListener('DOMContentLoaded',startGrid,{once:true});
  document.addEventListener('exp-core:coordination',scheduleGrid);
  addEventListener('resize',scheduleGrid,{passive:true});
  // Core-owned product bootstrap for downstream consumers.
  function createProductServices(options = {}) {
    const productId = String(options.productId || '').toLowerCase();
    const repository = String(options.repository || '');
    const currentVersion = options.currentVersion;
    if (!productId || !repository || (typeof currentVersion !== 'function' && !String(currentVersion || ''))) {
      throw new Error('Incomplete product services configuration');
    }
    const lifecycle = createProductLifecycle(api);
    const diagnostics = Object.freeze({
      createDiagnosticsReport,
      downloadDiagnostics,
      createDiagnosticsControls,
    });
    const updates = createReleaseUpdateChecker({
      productId,
      repository,
      currentVersion,
      endpoint: options.endpoint,
      enabled: options.enabled,
      onError: options.onError,
    });
    return Object.freeze({ lifecycle, diagnostics, updates });
  }

  const api = Object.freeze({...ExtraPotionsTools,version,sourceVersion,protocol,gridProtocol,reference:CoreFoundation,css:canonicalCss,themes,create,createProduct,createSupportControl,createProductNotice,createLifecycle:()=>createProductLifecycle(api),createProductServices,registerLauncher,layout:layoutGrid,replaceMenuContent,createDisclosure,createSystemGrid,menuWidthForMode,cloneSettings,applyTextGradient,injectStyle,applyTheme,applyMatteToggleChrome,applyTwoColumnSettingsGrid,applyContentDrivenMenuLayout,createThemeSwatches,publishMenuPalette,createFloatingNotice,createMenuNotice,createReleaseUpdateChecker,registerFloatingNotice,layoutFloatingNotices,claimNotice,consumeVersionChange,focusMenuSurface,registerDiagnosticsProduct,registerSuiteProduct,suiteContract,suiteSnapshot,hasProductCapability,capabilityProviders,emitSuiteEvent,publishSuiteState,suiteStateSnapshot,latestSuiteState,subscribeSuiteState,onSuiteEvent,pageContext,observeNavigation,navigationObserverState,suiteTrust:SUITE_TRUST,registerPresentationProvider,presentationProviders,suiteHealth,readPresentationState,setPresentationState,clearPresentationState,presentationStateChain,isPresentationSuppressed,presentationPhases:PRESENTATION_PHASES,presentationChannels:PRESENTATION_CHANNELS,observePresentationState,observePage,observePageBatch,pageObserverState,suiteProducts:SUITE_PRODUCTS,suitePriority:SUITE_PRIORITY,productCompatibility:productCompatibilityReport,createCompatibilityControls:createSuiteCompatibilityControls,bindDiagnosticsControls:ExtraPotionsDiagnostics.bindControls,createDiagnosticsReport,downloadDiagnostics,createDiagnosticsControls,mountMenuArrangement:ExpMenuArrangement.mount,menuCategories:ExpMenuArrangement.categories,categorizeMenuSections:ExpMenuArrangement.describe,createMenuCategoryDisclosure:(label,category,...contents)=>ExpMenuArrangement.createDisclosure({document,label,category,contents}),collapseMenuSubmenus:ExpMenuArrangement.collapseSubmenus,compareVersions:CoreFoundation.compareVersions});
  return api;
})();

const services = ExtraPotionsCore.createProductServices({
  productId: 'prisma',
  repository: 'ExtraPotions/PRISMA',
  currentVersion: () => EXP.VERSION,
  enabled: () => EXP.Settings.snapshot().updateNotifications,
  onError: error => EXP.Core.safeError(Object.assign(error, { code: 'UPDATE_CHECK' }), 'prisma'),
});
EXP.Core = services.lifecycle;
EXP.Diagnostics = services.diagnostics;
EXP.Updates = services.updates;

EXP.CatalogData = [
  {
    "id": "rainbow",
    "label": "Rainbow / LGBTQ+",
    "words": [
      "queer",
      "lgbtq",
      "lgbtq+",
      "lgbt",
      "lgbt+",
      "lgbtqia",
      "lgbtqia+",
      "pride flag",
      "pride flags"
    ],
    "colors": [
      "#E50000",
      "#FF8D00",
      "#FFEE00",
      "#028121",
      "#004CFF",
      "#770088"
    ],
    "definition": "A shared symbol of LGBTQ+ communities and pride.",
    "category": "Community term",
    "sources": [
      "https://gilbertbaker.com/rainbow-flag-color-meanings/",
      "https://en.wikipedia.org/wiki/Pride_flag"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2023-04-12.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Gay_Pride_Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Six-stripe rainbow, Commons 2023 representation",
      "source": "https://commons.wikimedia.org/wiki/File:Gay_Pride_Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Pride_flag"
      ],
      "evidence": "Pride flag introduction identifies the rainbow as an LGBTQ community symbol."
    }
  },
  {
    "id": "progress-pride",
    "label": "Progress Pride",
    "words": [
      "progress pride",
      "progresspride",
      "inclusive pride"
    ],
    "colors": [
      "#000000",
      "#613915",
      "#74D7EE",
      "#FFAFC8",
      "#FFFFFF",
      "#E40303",
      "#FF8C00",
      "#FFED00",
      "#008026",
      "#004DFF",
      "#750787"
    ],
    "definition": "A rainbow flag with a chevron emphasizing inclusion and continued progress.",
    "category": "Community term",
    "sources": [
      "https://progress.gay/",
      "https://en.wikipedia.org/wiki/Rainbow_flag_(LGBTQ)"
    ],
    "flag": {
      "status": "legacy",
      "note": "Creator documents chevron design and CC0 status; not the intersex-inclusive variant.",
      "sources": [
        "https://progress.gay/"
      ],
      "reviewStatus": "documented",
      "variant": "Daniel Quasar Progress Pride design"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Rainbow_flag_(LGBTQ)"
      ],
      "evidence": "Progress subsection defines the inclusion-focused chevron redesign."
    }
  },
  {
    "id": "philadelphia-pride",
    "label": "Philadelphia Pride",
    "words": [
      "philadelphia pride",
      "philly pride",
      "more color more pride"
    ],
    "colors": [
      "#000000",
      "#784F17",
      "#E40303",
      "#FF8C00",
      "#FFED00",
      "#008026",
      "#004DFF",
      "#750787"
    ],
    "definition": "A rainbow flag adding black and brown stripes to recognize LGBTQ+ people of color.",
    "category": "Community term",
    "sources": [
      "https://www.phila.gov/press-releases/kenney/city-and-office-of-lgbt-affairs-kick-off-pride-month/",
      "https://en.wikipedia.org/wiki/Rainbow_flag_(LGBTQ)"
    ],
    "flag": {
      "status": "legacy",
      "note": "City launch announcement identifies Tierney collaboration and added stripes.",
      "sources": [
        "https://www.phila.gov/press-releases/kenney/city-and-office-of-lgbt-affairs-kick-off-pride-month/"
      ],
      "reviewStatus": "documented",
      "variant": "Philadelphia More Color, More Pride (2017)"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Rainbow_flag_(LGBTQ)"
      ],
      "evidence": "Philadelphia subsection explains added black/brown stripes recognizing LGBTQ people of color."
    }
  },
  {
    "id": "gay",
    "label": "Gay",
    "words": [
      "gay",
      "achillean",
      "mlm"
    ],
    "colors": [
      "#078D70",
      "#26CEAA",
      "#98E8C1",
      "#FFFFFF",
      "#7BADE2",
      "#5049CC",
      "#3D1A78"
    ],
    "definition": "Attraction to people of the same gender.",
    "category": "Community term",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Gay"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact ordered fills read from current Commons SVG on 2026-09-26. Preserve distinction from general gay/MLM/achillean identities.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:New_Gay_Pride_Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "gayflagblog seven-stripe gay-men design, Commons SVG",
      "source": "https://commons.wikimedia.org/wiki/File:New_Gay_Pride_Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Gay"
      ],
      "evidence": "Lead defines same-sex attraction and notes frequent male-specific usage."
    },
    "recognitionNote": "This recognition group retains achillean and MLM for saved-setting compatibility. Those terms can include men attracted to multiple genders; they are not exact synonyms for gay. The selected flag represents gay men."
  },
  {
    "id": "lesbian",
    "label": "Lesbian",
    "words": [
      "lesbian",
      "wlw"
    ],
    "colors": [
      "#D52D00",
      "#EF7627",
      "#FF9A56",
      "#FFFFFF",
      "#D162A4",
      "#B55690",
      "#A30262"
    ],
    "definition": "A woman attracted to women; some nonbinary people also use this identity.",
    "category": "Community term",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Lesbian"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact fills and y coordinates read from current 669-byte Commons SVG on 2026-09-26.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Lesbian_pride_flag_2018.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Emily Gwen seven-stripe orange-pink lesbian design, Commons SVG",
      "source": "https://commons.wikimedia.org/wiki/File:Lesbian_pride_flag_2018.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Lesbian"
      ],
      "evidence": "Lead defines female homosexuality; self-identification section expressly includes nonbinary lesbians."
    },
    "recognitionNote": "This recognition group retains WLW for saved-setting compatibility. WLW is broader than lesbian and can include women attracted to multiple genders. The selected flag represents lesbians."
  },
  {
    "id": "bisexual",
    "label": "Bisexual",
    "words": [
      "bisexual",
      "bisexuality"
    ],
    "colors": [
      "#D60270",
      "#D60270",
      "#9B4F96",
      "#0038A8",
      "#0038A8"
    ],
    "definition": "Attraction to more than one gender.",
    "category": "Sexual orientation",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Bisexuality"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision current file inspected 2026-09-26.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Bisexual_Pride_Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Michael Page three-band bisexual design, 2:1:2 proportions",
      "source": "https://commons.wikimedia.org/wiki/File:Bisexual_Pride_Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Bisexuality"
      ],
      "evidence": "Lead defines attraction to more than one gender."
    }
  },
  {
    "id": "pansexual",
    "label": "Pansexual",
    "words": [
      "pansexual",
      "pansexuality"
    ],
    "colors": [
      "#FF218C",
      "#FFD800",
      "#21B1FF"
    ],
    "definition": "Attraction regardless of gender.",
    "category": "Sexual orientation",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Pansexuality"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2023-03-20.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Pansexuality_Pride_Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Three-stripe pansexual flag",
      "source": "https://commons.wikimedia.org/wiki/File:Pansexuality_Pride_Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Pansexuality"
      ],
      "evidence": "Lead includes attraction regardless of gender."
    }
  },
  {
    "id": "transgender",
    "label": "Transgender",
    "words": [
      "transgender"
    ],
    "colors": [
      "#5BCEFA",
      "#F5A9B8",
      "#FFFFFF",
      "#F5A9B8",
      "#5BCEFA"
    ],
    "definition": "A gender that differs from the sex assigned at birth.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Transgender"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2023-06-26.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Transgender_Pride_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Monica Helms five-stripe design",
      "source": "https://commons.wikimedia.org/wiki/File:Transgender_Pride_flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Transgender"
      ],
      "evidence": "Lead distinguishes gender identity from assigned sex."
    }
  },
  {
    "id": "transmasculine",
    "label": "Transmasculine",
    "words": [
      "transmasculine",
      "transmasc"
    ],
    "colors": [
      "#FF8ABD",
      "#CDF5FE",
      "#9AEBFF",
      "#74DFFF",
      "#9AEBFF",
      "#CDF5FE",
      "#FF8ABD"
    ],
    "definition": "A transgender identity aligned with masculinity; not necessarily a man.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Transgender"
    ],
    "flag": {
      "status": "legacy",
      "note": "Commons source identifies an alternative design; does not validate inherited seven-stripe palette.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Transmasculine_Pride_Flag.png"
      ],
      "reviewStatus": "documented",
      "variant": "Throwawayacountyay alternative transmasculine design (2019)"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Transgender"
      ],
      "evidence": "Related terminology defines masculine-aligned binary or nonbinary people assigned female at birth."
    }
  },
  {
    "id": "transfeminine",
    "label": "Transfeminine",
    "words": [
      "transfeminine",
      "transfem",
      "transfemme"
    ],
    "colors": [
      "#73DEFF",
      "#FFE0ED",
      "#FFB5D5",
      "#FF8CBE",
      "#FFB5D5",
      "#FFE0ED",
      "#73DEFF"
    ],
    "definition": "A transgender identity aligned with femininity; not necessarily a woman.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Transgender"
    ],
    "flag": {
      "status": "legacy",
      "note": "Public flag file documented; inherited palette not matched.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Transfeminine_Pride_Flag.png"
      ],
      "reviewStatus": "documented",
      "variant": "Transfeminine alternative flag represented on Commons"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Transgender"
      ],
      "evidence": "Related terminology defines feminine-aligned binary or nonbinary people assigned male at birth."
    }
  },
  {
    "id": "non-binary",
    "label": "Non-binary",
    "words": [
      "nonbinary",
      "non-binary",
      "enby",
      "non binary"
    ],
    "colors": [
      "#FFF433",
      "#FFFFFF",
      "#9B59D0",
      "#2D2D2D"
    ],
    "definition": "A gender identity outside an exclusively man-or-woman binary.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "flag": {
      "status": "verified",
      "variant": "Kye Rowan four-stripe design",
      "source": "https://commons.wikimedia.org/wiki/File:Nonbinary_flag.svg",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2023-05-25.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Nonbinary_flag.svg"
      ],
      "reviewStatus": "documented"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Lead defines genders beyond the male/female binary."
    }
  },
  {
    "id": "asexual",
    "label": "Asexual",
    "words": [
      "asexual",
      "asexuality"
    ],
    "colors": [
      "#000000",
      "#A3A3A3",
      "#FFFFFF",
      "#800080"
    ],
    "definition": "Little or no sexual attraction.",
    "category": "Sexual orientation",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Asexuality"
    ],
    "flag": {
      "status": "verified",
      "variant": "Four-stripe asexual flag",
      "source": "https://commons.wikimedia.org/wiki/File:Asexual_Pride_Flag.svg",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2018-04-06.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Asexual_Pride_Flag.svg"
      ],
      "reviewStatus": "documented"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Asexuality"
      ],
      "evidence": "Lead and infobox describe absent or minimal sexual attraction."
    }
  },
  {
    "id": "aromantic",
    "label": "Aromantic",
    "words": [
      "aromantic",
      "aromanticism"
    ],
    "colors": [
      "#3DA542",
      "#A7D379",
      "#FFFFFF",
      "#A9A9A9",
      "#000000"
    ],
    "definition": "Little or no romantic attraction.",
    "category": "Romantic orientation",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Aromanticism"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2018-04-07.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Aromantic_Pride_Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Cameron Whimsy five-stripe design",
      "source": "https://commons.wikimedia.org/wiki/File:Aromantic_Pride_Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Aromanticism"
      ],
      "evidence": "Lead defines absent or minimal romantic attraction."
    }
  },
  {
    "id": "aroace",
    "label": "AroAce",
    "words": [
      "aroace",
      "aromantic asexual",
      "aromantic-asexual",
      "aromantic/asexual"
    ],
    "colors": [
      "#E28C00",
      "#ECCD00",
      "#FFFFFF",
      "#62AEDC",
      "#203856"
    ],
    "definition": "Both aromantic and asexual.",
    "category": "Community term",
    "sources": [
      "https://www.aromanticism.org/en/basic-terms",
      "https://en.wikipedia.org/wiki/Aromanticism"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact rect fill colors and heights read from Commons SVG; header identifies aroaesflags original post and public-domain design.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Aroace_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Aroaesflags sunset aroace design, Rummskartoffel Commons SVG",
      "source": "https://commons.wikimedia.org/wiki/File:Aroace_flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Aromanticism"
      ],
      "evidence": "Definition section explicitly identifies people both aromantic and asexual as aroace."
    }
  },
  {
    "id": "oriented-aroace",
    "label": "Oriented Aroace",
    "words": [
      "oriented aroace",
      "oriented-aroace",
      "orientedaroace"
    ],
    "colors": [
      "#161639",
      "#7EA2B6",
      "#FFFFFF",
      "#36AEA0"
    ],
    "definition": "An aroace identity that also recognizes significant attraction that is neither romantic nor sexual.",
    "category": "Community term",
    "sources": [
      "https://www.aromanticism.org/en/identity-terms",
      "https://de.wikipedia.org/wiki/Aromantik"
    ],
    "flag": {
      "status": "verified",
      "note": "Creator explicitly supplies ordered hex colors on July 11, 2018.",
      "sources": [
        "https://biaroace.tumblr.com/post/175789820577/oriented-aroace-flag-this-flag-is-meant-to"
      ],
      "reviewStatus": "documented",
      "variant": "Biaroace four-stripe oriented aroace flag (2018)",
      "source": "https://biaroace.tumblr.com/post/175789820577/oriented-aroace-flag-this-flag-is-meant-to"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://de.wikipedia.org/wiki/Aromantik"
      ],
      "evidence": "German article defines oriented/angled aroace through significant tertiary attraction; separately defines tertiary attraction as neither romantic nor sexual. It groups the two labels, so do not infer they are always interchangeable."
    }
  },
  {
    "id": "acespec",
    "label": "Acespec",
    "words": [
      "acespec",
      "ace-spec",
      "ace spectrum",
      "asexual spectrum"
    ],
    "colors": [
      "#000000",
      "#A3A3A3",
      "#FFFFFF",
      "#CB7FCC",
      "#800080"
    ],
    "definition": "An umbrella for asexual identities and experiences of limited or conditional sexual attraction.",
    "category": "Community term",
    "sources": [
      "https://www.aromanticism.org/en/basic-terms",
      "https://en.wikipedia.org/wiki/Asexuality"
    ],
    "flag": {
      "status": "legacy",
      "note": "Public spectrum article documents an ace-spectrum flag and use of asexual flag; inherited five-stripe palette not matched.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Asexual_spectrum"
      ],
      "reviewStatus": "documented",
      "variant": "Asexual-spectrum flag variants"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Asexuality"
      ],
      "evidence": "Lead describes ace spectrum as the broader range of asexual subidentities."
    }
  },
  {
    "id": "arospec",
    "label": "Arospec",
    "words": [
      "arospec",
      "aro-spec",
      "aro spectrum",
      "aromantic spectrum"
    ],
    "colors": [
      "#3DA542",
      "#A7D379",
      "#FFFFFF",
      "#E89EC8",
      "#C94C9C"
    ],
    "definition": "An umbrella for aromantic identities and experiences of limited, conditional, or otherwise nonnormative romantic attraction.",
    "category": "Community term",
    "sources": [
      "https://www.aromanticism.org/en/basic-terms",
      "https://en.wikipedia.org/wiki/Aromanticism"
    ],
    "flag": {
      "status": "legacy",
      "note": "Named flag is catalogued in the public flag gallery; this establishes documentation, not exact colors.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Pride_flag_gallery"
      ],
      "reviewStatus": "documented",
      "variant": "Variant attribution unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Aromanticism"
      ],
      "evidence": "Spectrum section explains umbrella and conditional, weak or rare attraction."
    }
  },
  {
    "id": "demisexual",
    "label": "Demisexual",
    "words": [
      "demisexual",
      "demi"
    ],
    "colors": [
      "#000000",
      "#FFFFFF",
      "#6E0070",
      "#D2D2D2"
    ],
    "definition": "Sexual attraction that develops after an emotional bond.",
    "category": "Sexual orientation",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Demisexuality"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2018-04-07.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Demisexual_Pride_Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Black triangle with white-purple-gray bands",
      "source": "https://commons.wikimedia.org/wiki/File:Demisexual_Pride_Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Demisexuality"
      ],
      "evidence": "Definition section requires an emotional bond before sexual attraction."
    },
    "recognitionNote": "The retained shorthand demi is broader than demisexual and requires supporting context."
  },
  {
    "id": "demiromantic",
    "label": "Demiromantic",
    "words": [
      "demiromantic"
    ],
    "colors": [
      "#000000",
      "#FFFFFF",
      "#338A37",
      "#D2D2D2"
    ],
    "definition": "Romantic attraction only after an emotional connection forms.",
    "category": "Community term",
    "sources": [
      "https://www.aromanticism.org/en/identity-terms",
      "https://en.wikipedia.org/wiki/Aromanticism"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact path fill colors and coordinates read from Commons SVG, revision 2025-06-12.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Demiromantic_Pride_Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Demiromantic black triangle with white-green-gray bands",
      "source": "https://commons.wikimedia.org/wiki/File:Demiromantic_Pride_Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Aromanticism"
      ],
      "evidence": "Spectrum section defines attraction after a close nonromantic bond."
    }
  },
  {
    "id": "graysexual",
    "label": "Graysexual",
    "words": [
      "graysexual",
      "greysexual",
      "gray-asexual",
      "grey-asexual"
    ],
    "colors": [
      "#740195",
      "#B2B2B2",
      "#FFFFFF",
      "#B2B2B2",
      "#740195"
    ],
    "definition": "Sexual attraction experienced rarely or under limited circumstances.",
    "category": "Sexual orientation",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Gray_asexuality"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact path fill colors and y coordinates read from current Commons SVG on 2026-09-26.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Grey_asexuality_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Five-stripe gray-asexual flag, Commons SVG",
      "source": "https://commons.wikimedia.org/wiki/File:Grey_asexuality_flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Gray_asexuality"
      ],
      "evidence": "Definitions describe infrequent, weak or conditional sexual attraction."
    }
  },
  {
    "id": "grayromantic",
    "label": "Grayromantic",
    "words": [
      "grayromantic",
      "greyromantic",
      "gray-aromantic",
      "grey-aromantic"
    ],
    "colors": [
      "#087D16",
      "#B2B2B2",
      "#FFFFFF",
      "#B2B2B2",
      "#087D16"
    ],
    "definition": "Romantic attraction that is rare, weak, unreliable, or arises under limited circumstances.",
    "category": "Community term",
    "sources": [
      "https://www.aromanticism.org/en/identity-terms",
      "https://en.wikipedia.org/wiki/Aromanticism"
    ],
    "flag": {
      "status": "legacy",
      "note": "Public flag archive linked by AUREA inspected; exact values not verified.",
      "sources": [
        "https://pride-color-schemes.tumblr.com/post/146792327505/gray-aromantic"
      ],
      "reviewStatus": "documented",
      "variant": "Gray-aromantic flag variants"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Aromanticism"
      ],
      "evidence": "Spectrum section defines weak, infrequent or conditional romantic attraction."
    }
  },
  {
    "id": "cupiosexual",
    "label": "Cupiosexual",
    "words": [
      "cupiosexual",
      "cupio"
    ],
    "colors": [
      "#FCA9C4",
      "#FFFFFF",
      "#CBCBCB",
      "#161616"
    ],
    "definition": "Desiring a sexual relationship despite experiencing little or no sexual attraction.",
    "category": "Community term",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Asexual_spectrum",
      "https://en.wikipedia.org/wiki/Asexuality"
    ],
    "flag": {
      "status": "legacy",
      "note": "Article displays named cupiosexual flag; legacy pink-white-gray-black palette not corroborated.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Asexual_spectrum"
      ],
      "reviewStatus": "documented",
      "variant": "Cupiosexual flag documented in spectrum article"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Asexuality"
      ],
      "evidence": "Microlabels section defines relationship desire without sexual attraction."
    }
  },
  {
    "id": "fraysexual",
    "label": "Fraysexual",
    "words": [
      "fraysexual",
      "fray"
    ],
    "colors": [
      "#6B8EC2",
      "#94CEF1",
      "#FFFFFF",
      "#636363"
    ],
    "definition": "Attraction to less familiar people that can fade as familiarity or emotional connection grows.",
    "category": "Community term",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Asexual_spectrum",
      "https://en.wikipedia.org/wiki/Gray_asexuality"
    ],
    "flag": {
      "status": "legacy",
      "note": "Article displays named fraysexual flag; exact values not verified.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Asexual_spectrum"
      ],
      "reviewStatus": "documented",
      "variant": "Fraysexual flag documented in spectrum article"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Gray_asexuality"
      ],
      "evidence": "Fraysexuality section describes attraction to unfamiliar people that can disappear with emotional connection."
    }
  },
  {
    "id": "lithromantic",
    "label": "Lithromantic",
    "words": [
      "lithromantic",
      "akoiromantic",
      "lithro",
      "akoi"
    ],
    "colors": [
      "#FF2B66",
      "#FF9146",
      "#FFF152",
      "#FFFFFF",
      "#000000"
    ],
    "definition": "Romantic attraction without wanting reciprocation, or attraction that fades when reciprocated.",
    "category": "Community term",
    "sources": [
      "https://www.aromanticism.org/en/identity-terms",
      "https://en.wikipedia.org/wiki/Aromanticism"
    ],
    "flag": {
      "status": "legacy",
      "note": "Public flag archive linked by AUREA inspected; exact values not verified.",
      "sources": [
        "https://pride-color-schemes.tumblr.com/post/146499968709/akoi-akoine-lith-akoin"
      ],
      "reviewStatus": "documented",
      "variant": "Akoi/lith flag variants"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Aromanticism"
      ],
      "evidence": "Spectrum section describes unwanted reciprocation or attraction disappearing when reciprocated."
    }
  },
  {
    "id": "genderfluid",
    "label": "Genderfluid",
    "words": [
      "genderfluid",
      "gender-fluid",
      "gender fluid"
    ],
    "colors": [
      "#FF75A2",
      "#F5F5F5",
      "#BE18D6",
      "#2C2C2C",
      "#333EBD"
    ],
    "definition": "A gender experience that changes over time.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2021-09-02.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Genderfluidity_Pride-Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "JJ Poole five-stripe design, Commons representation",
      "source": "https://commons.wikimedia.org/wiki/File:Genderfluidity_Pride-Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Genderfluid section defines gender changing with time and situation."
    }
  },
  {
    "id": "genderflux",
    "label": "Genderflux",
    "words": [
      "genderflux"
    ],
    "colors": [
      "#F47694",
      "#F2A3B9",
      "#CECECE",
      "#7CE0F7",
      "#3ECDF9",
      "#FFF48E"
    ],
    "definition": "A gender experience whose intensity changes over time.",
    "category": "Gender identity",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Genderflux",
      "https://en.wikipedia.org/wiki/List_of_gender_identities"
    ],
    "flag": {
      "status": "legacy",
      "note": "Article identifies six stripe colors and uncertain creator.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Genderflux"
      ],
      "reviewStatus": "documented",
      "variant": "Six-stripe genderflux flag"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/List_of_gender_identities"
      ],
      "evidence": "Identity name appears in the Wikipedia list; this supports listed status only, not the full catalog definition or scientific approval."
    }
  },
  {
    "id": "genderqueer",
    "label": "Genderqueer",
    "words": [
      "genderqueer",
      "gender-queer",
      "gender queer"
    ],
    "colors": [
      "#B57EDC",
      "#FFFFFF",
      "#4A8123"
    ],
    "definition": "A gender identity outside exclusively binary categories.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2018-04-07.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Genderqueer_Pride_Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Marilyn Roxie three-stripe design",
      "source": "https://commons.wikimedia.org/wiki/File:Genderqueer_Pride_Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Terms section describes identities beyond binary categories."
    }
  },
  {
    "id": "agender",
    "label": "Agender",
    "words": [
      "agender"
    ],
    "colors": [
      "#000000",
      "#B9B9B9",
      "#FFFFFF",
      "#B8F483",
      "#FFFFFF",
      "#B9B9B9",
      "#000000"
    ],
    "definition": "Having no gender, or not identifying with gender.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "flag": {
      "status": "verified",
      "variant": "Salem Fontana seven-stripe design",
      "source": "https://commons.wikimedia.org/wiki/File:Agender_pride_flag.svg",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2023-06-18.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Agender_pride_flag.svg"
      ],
      "reviewStatus": "documented"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Agender section describes lacking gender."
    }
  },
  {
    "id": "bigender",
    "label": "Bigender",
    "words": [
      "bigender"
    ],
    "colors": [
      "#C479D9",
      "#EDA5CD",
      "#D8D8D8",
      "#A4E8D8",
      "#6ADEC9"
    ],
    "definition": "Experiencing two genders, together or at different times.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "flag": {
      "status": "legacy",
      "note": "Named flag is catalogued in the public flag gallery; this establishes documentation, not exact colors.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Pride_flag_gallery"
      ],
      "reviewStatus": "documented",
      "variant": "Variant attribution unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Bigender section defines two genders, simultaneous or changing."
    }
  },
  {
    "id": "pangender",
    "label": "Pangender",
    "words": [
      "pangender"
    ],
    "colors": [
      "#FFF798",
      "#FEDDCC",
      "#FFEBFC",
      "#FFFFFF",
      "#FFEBFC",
      "#FEDDCC",
      "#FFF798"
    ],
    "definition": "Experiencing many or all genders within one’s cultural and personal experience.",
    "category": "Gender identity",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Pangender",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact fills and stripe dimensions read from 291-byte Commons SVG, revision 2020-06-29.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Pangender_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Seven-stripe pangender flag, Nikki Commons SVG (2020)",
      "source": "https://commons.wikimedia.org/wiki/File:Pangender_flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Pangender section defines multiple or all genders."
    }
  },
  {
    "id": "demigirl",
    "label": "Demigirl",
    "words": [
      "demigirl",
      "demi-girl",
      "demiwoman",
      "demi-woman"
    ],
    "colors": [
      "#7F7F7F",
      "#C4C4C4",
      "#FFAEC9",
      "#FFFFFF",
      "#FFAEC9",
      "#C4C4C4",
      "#7F7F7F"
    ],
    "definition": "A partial connection to being a girl or woman.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "flag": {
      "status": "legacy",
      "note": "Named flag is catalogued in the public flag gallery; this establishes documentation, not exact colors.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Pride_flag_gallery"
      ],
      "reviewStatus": "documented",
      "variant": "Variant attribution unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Demigender section explicitly defines partial female identification."
    }
  },
  {
    "id": "demiboy",
    "label": "Demiboy",
    "words": [
      "demiboy",
      "demiboi",
      "demi-boy",
      "demiman",
      "demi-man"
    ],
    "colors": [
      "#7F7F7F",
      "#C4C4C4",
      "#9AD9EB",
      "#FFFFFF",
      "#9AD9EB",
      "#C4C4C4",
      "#7F7F7F"
    ],
    "definition": "A partial connection to being a boy or man.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "flag": {
      "status": "legacy",
      "note": "Named flag is catalogued in the public flag gallery; this establishes documentation, not exact colors.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Pride_flag_gallery"
      ],
      "reviewStatus": "documented",
      "variant": "Variant attribution unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Demigender section explicitly defines partial male identification."
    }
  },
  {
    "id": "demigender",
    "label": "Demigender",
    "words": [
      "demigender",
      "demi-gender"
    ],
    "colors": [
      "#7F7F7F",
      "#C4C4C4",
      "#FBFF74",
      "#FFFFFF",
      "#FBFF74",
      "#C4C4C4",
      "#7F7F7F"
    ],
    "definition": "A partial connection to a gender.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "flag": {
      "status": "legacy",
      "note": "Named flag is catalogued in the public flag gallery; this establishes documentation, not exact colors.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Pride_flag_gallery"
      ],
      "reviewStatus": "documented",
      "variant": "Variant attribution unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Demigender section defines partial gender connection."
    }
  },
  {
    "id": "maverique",
    "label": "Maverique",
    "words": [
      "maverique",
      "maverick gender"
    ],
    "colors": [
      "#FFF344",
      "#FFFFFF",
      "#F49622"
    ],
    "definition": "An autonomous gender outside male, female, and neutral categories; not an absence of gender.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/List_of_gender_identities"
    ],
    "flag": {
      "status": "legacy",
      "note": "Community encyclopedia describes colors and Vesper H. identity origin.",
      "sources": [
        "https://nonbinary.wiki/wiki/Maverique"
      ],
      "reviewStatus": "documented",
      "variant": "Yellow-white-orange maverique flag"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/List_of_gender_identities"
      ],
      "evidence": "Identity name appears in the Wikipedia list; this supports listed status only, not the full catalog definition or scientific approval."
    }
  },
  {
    "id": "androgyne",
    "label": "Androgyne",
    "words": [
      "androgyne",
      "androgynous"
    ],
    "colors": [
      "#FE76A2",
      "#9832CC",
      "#00B8E7"
    ],
    "definition": "A gender involving masculine and feminine aspects, or a position between them; appearance need not reflect identity.",
    "category": "Gender identity",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Androgyny"
    ],
    "flag": {
      "status": "legacy",
      "note": "Named flag is catalogued in the public flag gallery; this establishes documentation, not exact colors.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Pride_flag_gallery"
      ],
      "reviewStatus": "documented",
      "variant": "Variant attribution unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Androgyny"
      ],
      "evidence": "Gender identity section defines masculine and feminine aspects separately from appearance."
    },
    "recognitionNote": "Androgynous can describe expression as well as identity. Recognizing the word does not establish an androgyne identity."
  },
  {
    "id": "neutrois",
    "label": "Neutrois",
    "words": [
      "neutrois"
    ],
    "colors": [
      "#FFFFFF",
      "#008000",
      "#000000"
    ],
    "definition": "A neutral gender identity; some people use the term for an absence of gender.",
    "category": "Community term",
    "sources": [
      "https://nonbinary.wiki/wiki/Neutrois",
      "https://en.wikipedia.org/wiki/Neutrois"
    ],
    "flag": {
      "status": "verified",
      "note": "SVG uses white, CSS green, and default black in three vertical bands; current 740-byte representation inspected 2026-09-26. This differs in orientation from the commonly documented horizontal tricolor.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Neutrois_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "White-green-black vertical neutrois tricolor, Commons SVG",
      "source": "https://commons.wikimedia.org/wiki/File:Neutrois_flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Neutrois"
      ],
      "evidence": "Redirected Agender article, Neutrois section: neutral gender with overlap in agender usage."
    }
  },
  {
    "id": "trigender",
    "label": "Trigender",
    "words": [
      "trigender"
    ],
    "colors": [
      "#FF95C5",
      "#9588C8",
      "#6DE08D",
      "#9588C8",
      "#FF95C5"
    ],
    "definition": "Experiencing three genders, together or at different times.",
    "category": "Community term",
    "sources": [
      "https://en.wikipedia.org/wiki/Non-binary",
      "https://es.wikipedia.org/wiki/Identidad_de_g%C3%A9nero"
    ],
    "flag": {
      "status": "legacy",
      "note": "Named flag is catalogued in the public flag gallery; this establishes documentation, not exact colors.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Pride_flag_gallery"
      ],
      "reviewStatus": "documented",
      "variant": "Variant attribution unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary",
        "https://es.wikipedia.org/wiki/Identidad_de_g%C3%A9nero"
      ],
      "evidence": "Bigender section defines shifting among three genders; simultaneous usage supported by Spanish gender-identity article."
    }
  },
  {
    "id": "polygender",
    "label": "Polygender",
    "words": [
      "polygender"
    ],
    "colors": [
      "#000000",
      "#939393",
      "#ED94C4",
      "#F5ED81",
      "#64BBE6"
    ],
    "definition": "Experiencing multiple genders.",
    "category": "Gender identity",
    "sources": [
      "https://nonbinary.wiki/wiki/Polygender",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact pixels sampled at the center of each of five stripes from original 1153x692 PNG (12348 bytes), Commons revision 2020-07-11. These values identify that asset, not an official creator specification.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Polygender_Pride_Flag.png"
      ],
      "reviewStatus": "documented",
      "variant": "Five-stripe polygender flag, Commons raster representation (2020)",
      "source": "https://commons.wikimedia.org/wiki/File:Polygender_Pride_Flag.png"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Polygender section defines multiple genders."
    }
  },
  {
    "id": "genderfae",
    "label": "Genderfae",
    "words": [
      "genderfae",
      "genderdoe",
      "genderthil"
    ],
    "colors": [
      "#97C8A4",
      "#C3DEAE",
      "#F9FACB",
      "#FFFFFF",
      "#F9B8C5",
      "#D595E4",
      "#B18AE5"
    ],
    "definition": "Gender fluidity that excludes masculine and man-aligned genders.",
    "category": "Gender identity",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Genderfluid",
      "https://en.wikipedia.org/wiki/List_of_gender_identities"
    ],
    "flag": {
      "status": "legacy",
      "note": "Public article describes this named flag; exact values not verified.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Genderfluid"
      ],
      "reviewStatus": "documented",
      "variant": "genderfae seven-stripe flag"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/List_of_gender_identities"
      ],
      "evidence": "Identity name appears in the Wikipedia list; this supports listed status only, not the full catalog definition or scientific approval."
    }
  },
  {
    "id": "genderfaun",
    "label": "Genderfaun",
    "words": [
      "genderfaun",
      "genderfawn"
    ],
    "colors": [
      "#FCD6A4",
      "#FFF09B",
      "#FAF9CD",
      "#FFFFFF",
      "#8BC8EF",
      "#9F9DE0",
      "#A07CC7"
    ],
    "definition": "Gender fluidity that excludes feminine and woman-aligned genders.",
    "category": "Gender identity",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Genderfluid",
      "https://en.wikipedia.org/wiki/List_of_gender_identities"
    ],
    "flag": {
      "status": "legacy",
      "note": "Public article describes this named flag; exact values not verified.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Genderfluid"
      ],
      "reviewStatus": "documented",
      "variant": "genderfaun seven-stripe flag"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/List_of_gender_identities"
      ],
      "evidence": "Identity name appears in the Wikipedia list; this supports listed status only, not the full catalog definition or scientific approval."
    }
  },
  {
    "id": "genderflor",
    "label": "Genderflor",
    "words": [
      "genderflor"
    ],
    "colors": [
      "#A5D6A7",
      "#C8F0C0",
      "#F2F2C8",
      "#FFFFFF",
      "#F2C8F0",
      "#E0A8E8",
      "#C890D0"
    ],
    "definition": "Gender fluidity that excludes masculine, feminine, man-aligned, and woman-aligned genders.",
    "category": "Community term",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Genderfluid"
    ],
    "flag": {
      "status": "legacy",
      "note": "Public article describes this named flag; exact values not verified.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Genderfluid"
      ],
      "reviewStatus": "documented",
      "variant": "genderflor seven-stripe flag"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "omnisexual",
    "label": "Omnisexual",
    "words": [
      "omnisexual",
      "omni"
    ],
    "colors": [
      "#FC9CCC",
      "#FC54BC",
      "#240444",
      "#645CFC",
      "#8CA4FC"
    ],
    "definition": "Attraction to all genders, with gender playing a role in attraction.",
    "category": "Community term",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Omnisexual",
      "https://en.wikipedia.org/wiki/Omnisexuality"
    ],
    "flag": {
      "status": "verified",
      "note": "Article explicitly supplies top-to-bottom hex values, citing Pride Color Schemes.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Omnisexual"
      ],
      "reviewStatus": "documented",
      "variant": "Pastelmemer five-stripe omnisexual flag (2015)",
      "source": "https://lgbtqia.fandom.com/wiki/Omnisexual"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Omnisexuality"
      ],
      "evidence": "Lead defines attraction to all genders with gender contributing to attraction."
    }
  },
  {
    "id": "polysexual",
    "label": "Polysexual",
    "words": [
      "polysexual"
    ],
    "colors": [
      "#F61CB9",
      "#07D569",
      "#1C92F6"
    ],
    "definition": "Sexual attraction to multiple, but not necessarily all, genders.",
    "category": "Community term",
    "sources": [
      "https://en.wikipedia.org/wiki/Polysexuality"
    ],
    "flag": {
      "status": "verified",
      "note": "Exact ordered colors read from Commons inline SVG or explicit RGB table; asset revision 2018-04-06.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Polysexuality_Pride_Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Samlin three-stripe design, Commons representation",
      "source": "https://commons.wikimedia.org/wiki/File:Polysexuality_Pride_Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Polysexuality"
      ],
      "evidence": "Lead defines attraction to multiple genders, not necessarily all."
    }
  },
  {
    "id": "polyamorous",
    "label": "Polyamorous",
    "words": [
      "polyamorous",
      "polyam",
      "polyamory"
    ],
    "colors": [
      "#009FE3",
      "#E50051",
      "#340C46"
    ],
    "definition": "Having or being open to multiple loving relationships with everyone’s knowledge and consent.",
    "category": "Community term",
    "sources": [
      "https://en.wikipedia.org/wiki/Polyamory"
    ],
    "flag": {
      "status": "legacy",
      "note": "University guide documents design geometry; current three-color catalog omits emblem and chevron colors.",
      "sources": [
        "https://www.uwgb.edu/getmedia/16a85f6c-62ef-40f8-9c3e-df956da1adb5/What-in-the-Pride-Flag-does-this-mean.pdf"
      ],
      "reviewStatus": "documented",
      "variant": "Blue-magenta-purple tricolor with white chevron and yellow heart"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Polyamory"
      ],
      "evidence": "Lead defines multiple intimate relationships with informed consent of partners."
    }
  },
  {
    "id": "heteroflexible",
    "label": "Heteroflexible",
    "words": [
      "heteroflexible",
      "hetero-flexible",
      "heteroflex"
    ],
    "colors": [
      "#000000",
      "#51504D",
      "#7B7B7A",
      "#E40303",
      "#FF8C00",
      "#FFED00",
      "#008026",
      "#004DFF",
      "#750787",
      "#B0B1B0",
      "#DEDEDE",
      "#EEEEEE"
    ],
    "definition": "Primarily attracted to a different gender, with occasional same-gender attraction.",
    "category": "Community term",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Heteroflexibility"
    ],
    "flag": {
      "status": "legacy",
      "note": "Commons indexed description identifies flag; exact asset palette not inspected.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Heteroflexible_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Heteroflexible flag represented on Commons"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Heteroflexibility"
      ],
      "evidence": "Lead defines predominantly heterosexual attraction with limited same-sex attraction."
    }
  },
  {
    "id": "homoflexible",
    "label": "Homoflexible",
    "words": [
      "homoflexible",
      "homo-flexible",
      "homoflex"
    ],
    "colors": [
      "#EE3124",
      "#F57F29",
      "#FFF000",
      "#58B947",
      "#0054A6",
      "#9F248F",
      "#000000",
      "#333333",
      "#666666",
      "#999999",
      "#BBBBBB",
      "#FFFFFF"
    ],
    "definition": "Mostly attracted to the same gender, with occasional attraction to other genders.",
    "category": "Community term",
    "sources": [
      "https://bi.org/en/glossary/homoflexible/",
      "https://en.wikipedia.org/wiki/Heteroflexibility"
    ],
    "flag": {
      "status": "verified",
      "note": "Original SVG read: outer rainbow stripes top to bottom, followed by the central inset grayscale segments top to bottom. Geometry is essential.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Homoflexible_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Nikki Commons vector, March 2021",
      "source": "https://commons.wikimedia.org/wiki/File:Homoflexible_flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Heteroflexibility"
      ],
      "evidence": "Lead explicitly defines homoflexibility as the corresponding pattern where homosexual attraction predominates."
    }
  },
  {
    "id": "bicurious",
    "label": "Bicurious",
    "words": [
      "bicurious",
      "bi-curious",
      "bi curious"
    ],
    "colors": [
      "#F347F8",
      "#F787FA",
      "#FDC6FD",
      "#FFFFFF",
      "#C6E0FD",
      "#76B5FA",
      "#2D8CF7"
    ],
    "definition": "Exploring possible attraction to people of the same and different genders.",
    "category": "Sexual orientation",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Bi-curious"
    ],
    "flag": {
      "status": "verified",
      "note": "Original SVG read; top-to-bottom order verified. White and outer bands have different heights.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Bicurious_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Nikki Commons vector, restored August 2022",
      "source": "https://commons.wikimedia.org/wiki/File:Bicurious_flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Bi-curious"
      ],
      "evidence": "Article describes curiosity or experimentation concerning attraction outside the person’s usual orientation."
    }
  },
  {
    "id": "abrosexual",
    "label": "Abrosexual",
    "words": [
      "abrosexual",
      "abro"
    ],
    "colors": [
      "#65C286",
      "#B4E4CC",
      "#FFFFFF",
      "#E796B7",
      "#D9446E"
    ],
    "definition": "Experiencing changes in sexual orientation or attraction over time.",
    "category": "Community term",
    "sources": [
      "https://www.dictionary.com/culture/gender-sexuality/abrosexual",
      "https://en.wikipedia.org/wiki/Plurisexuality"
    ],
    "flag": {
      "status": "legacy",
      "note": "University of Colorado pride guide documents the green, light green, white, pink and dark pink flag.",
      "sources": [
        "https://www.colorado.edu/culturalconnections/media/1023"
      ],
      "reviewStatus": "documented",
      "variant": "Five-stripe green-to-pink flag"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Plurisexuality"
      ],
      "evidence": "Lead explicitly defines abrosexual through changes in attractions over time."
    }
  },
  {
    "id": "multisexual",
    "label": "Multisexual",
    "words": [
      "multisexual",
      "multi"
    ],
    "colors": [
      "#FF3B7B",
      "#FF8EC8",
      "#FFFFFF",
      "#7BB8FF",
      "#3B7BFF"
    ],
    "definition": "An umbrella term for attraction to more than one gender.",
    "category": "Community term",
    "sources": [
      "https://en.wikipedia.org/wiki/Plurisexuality"
    ],
    "flag": {
      "status": "legacy",
      "note": "Public flag exhibition document identifies a multisexual flag with purple, white, blue and pink.",
      "sources": [
        "https://www.fugues.com/wp-content/uploads/2025/08/Fugues_EXPO-2025.pdf"
      ],
      "reviewStatus": "documented",
      "variant": "2019 multisexual proposal"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Plurisexuality"
      ],
      "evidence": "Lead names multisexuality as an alternative term for attraction to multiple sexes or genders."
    }
  },
  {
    "id": "intersex",
    "label": "Intersex",
    "words": [
      "intersex"
    ],
    "colors": [
      "#FFD800",
      "#7902AA"
    ],
    "definition": "Born with variations in sex characteristics outside typical male or female patterns.",
    "category": "Sex characteristics",
    "sources": [
      "https://interactadvocates.org/faq/",
      "https://en.wikipedia.org/wiki/Intersex"
    ],
    "flag": {
      "status": "verified",
      "reviewStatus": "documented",
      "variant": "Morgan Carpenter 2013 intersex flag",
      "source": "https://morgancarpenter.com/intersex-flag/",
      "sources": [
        "https://morgancarpenter.com/intersex-flag/"
      ],
      "note": "Creator-specified background and emblem colors. This highlight palette does not reproduce the ring geometry."
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Intersex"
      ],
      "evidence": "Lead describes congenital variations in sex characteristics outside typical male/female definitions."
    }
  },
  {
    "id": "two-spirit",
    "label": "Two-Spirit",
    "words": [
      "two-spirit",
      "two spirit",
      "twospirit",
      "2-spirit",
      "2 spirit"
    ],
    "colors": [
      "#D62828",
      "#F77F00",
      "#FCBF49",
      "#2A9D8F",
      "#277DA1",
      "#7B2CBF"
    ],
    "definition": "A culturally specific term used by some Indigenous people for identities or roles involving gender, sexuality and spirituality.",
    "category": "Cultural identity",
    "sources": [
      "https://www.onwa.ca/love",
      "https://cejce.berkeley.edu/centers/gender-equity-resource-center/resources/educational-resources/terms-and-definitions",
      "https://en.wikipedia.org/wiki/Two-spirit"
    ],
    "flag": {
      "status": "legacy",
      "note": "WPI documents the two-feather variant.",
      "sources": [
        "https://www.wpi.edu/offices/diversity/student-resources/lgbtqiap-student-support/lgbtqiap-flags-terms"
      ],
      "reviewStatus": "documented",
      "variant": "Rainbow field with two feathers and circle"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Two-spirit"
      ],
      "evidence": "Article describes an Indigenous North American umbrella term for culturally specific gender and social identities."
    }
  },
  {
    "id": "sapphic",
    "label": "Sapphic",
    "words": [
      "sapphic"
    ],
    "colors": [
      "#FF8DC7",
      "#DDDDDD",
      "#D629A9",
      "#7B1FA2"
    ],
    "definition": "A term for women and some woman-aligned nonbinary people attracted to women.",
    "category": "Community term",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Sapphism"
    ],
    "flag": {
      "status": "legacy",
      "note": "Public article distinguishes the simplified violet from the earlier two-flower design.",
      "sources": [
        "https://www.lgbtqnation.com/2022/06/sapphic-pride-flag/"
      ],
      "reviewStatus": "documented",
      "variant": "Simplified violet emblem, 2017"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Sapphism"
      ],
      "evidence": "Terminology section includes women/woman-aligned individuals attracted to women and some nonbinary people."
    }
  },
  {
    "id": "queerplatonic",
    "label": "Queerplatonic",
    "words": [
      "queerplatonic",
      "queer-platonic",
      "qpr"
    ],
    "colors": [
      "#F9E26C",
      "#F5A9B8",
      "#FFFFFF",
      "#B0B0B0",
      "#000000"
    ],
    "definition": "A committed nonromantic relationship understood by its participants as going beyond usual friendship expectations.",
    "category": "Community term",
    "sources": [
      "https://www.aromanticism.org/en/faq",
      "https://en.wikipedia.org/wiki/Queerplatonic_relationship"
    ],
    "flag": {
      "status": "legacy",
      "note": "Indexed wiki documents the five-stripe queerplatonic flag.",
      "sources": [
        "https://prideflag.fandom.com/wiki/Queerplatonic_Flag"
      ],
      "reviewStatus": "documented",
      "variant": "Yellow, pink, white, gray and black variant"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Queerplatonic_relationship"
      ],
      "evidence": "Article defines nonromantic close relationships and commitment beyond conventional friendship."
    }
  },
  {
    "id": "butch",
    "label": "Butch",
    "words": [
      "butch"
    ],
    "colors": [
      "#D87800",
      "#F0C000",
      "#FDF29C",
      "#FFFFFF",
      "#A7A3D0",
      "#736EB5",
      "#504C9A"
    ],
    "definition": "A masculine-of-center identity or expression, often associated with lesbian and queer communities.",
    "category": "Gender expression",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Butch_and_femme"
    ],
    "flag": {
      "status": "legacy",
      "note": "Commons documents the orange variant and links its creator post.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Butch_Flag.png"
      ],
      "reviewStatus": "documented",
      "variant": "Butchspace / Mod Jim orange flag, 2017"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Butch_and_femme"
      ],
      "evidence": "Article defines butch through masculine identity/expression in lesbian and queer contexts."
    }
  },
  {
    "id": "femme",
    "label": "Femme",
    "words": [
      "femme"
    ],
    "colors": [
      "#EF87C3",
      "#F5B0D7",
      "#F8D2E8",
      "#FFFFFF",
      "#C9A7E6",
      "#9B6BC7",
      "#7A3BA8"
    ],
    "definition": "A feminine-of-center identity or expression used in LGBTQ communities.",
    "category": "Gender expression",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Butch_and_femme"
    ],
    "flag": {
      "status": "legacy",
      "note": "Indexed flag wiki attributes the purple flag to Tumblr user noodle.",
      "sources": [
        "https://prideflag.fandom.com/wiki/Femme_Flag"
      ],
      "reviewStatus": "documented",
      "variant": "Noodle purple flag"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Butch_and_femme"
      ],
      "evidence": "Article defines femme through feminine identity/expression in lesbian and queer contexts."
    }
  },
  {
    "id": "bear",
    "label": "Bear",
    "words": [
      "bear pride"
    ],
    "colors": [
      "#623804",
      "#D56300",
      "#FEDD63",
      "#FEE6B8",
      "#FFFFFF",
      "#555555",
      "#000000"
    ],
    "definition": "A community identity within gay and queer culture associated with a broad, often bearded or hairy masculine appearance.",
    "category": "Community term",
    "sources": [
      "https://marybaldwin.edu/news/2024/06/03/hidden-history-how-mbu-helped-invent-an-international-gay-pride-flag/",
      "https://en.wikipedia.org/wiki/Bear_(gay_culture)"
    ],
    "flag": {
      "status": "legacy",
      "note": "University interview documents Byrnes; flag description includes seven stripes and a paw emblem.",
      "sources": [
        "https://marybaldwin.edu/news/2024/06/03/hidden-history-how-mbu-helped-invent-an-international-gay-pride-flag/",
        "https://en.wikipedia.org/wiki/Bear_flag_(gay_culture)"
      ],
      "reviewStatus": "documented",
      "variant": "International Bear Brotherhood flag, 1995"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Bear_(gay_culture)"
      ],
      "evidence": "Article describes the gay subculture and masculine/hairy appearance associated with bear identification."
    }
  },
  {
    "id": "leather",
    "label": "Leather",
    "words": [
      "leather pride"
    ],
    "colors": [
      "#000000",
      "#18186B",
      "#000000",
      "#18186B",
      "#000000",
      "#FFFFFF",
      "#E70039",
      "#FFFFFF",
      "#000000",
      "#18186B",
      "#000000"
    ],
    "definition": "A community term for the leather subculture, with roots in LGBTQ history.",
    "category": "Community term",
    "sources": [
      "https://www.schwulesmuseum.de/bibliothek-archiv/object-of-the-month-may-leather-pride-flag/?lang=en",
      "https://en.wikipedia.org/wiki/Leather_subculture"
    ],
    "flag": {
      "status": "legacy",
      "note": "Museum documents nine alternating blue/black stripes with central white stripe and red heart. Creator did not prescribe color meanings.",
      "sources": [
        "https://www.schwulesmuseum.de/bibliothek-archiv/object-of-the-month-may-leather-pride-flag/?lang=en"
      ],
      "reviewStatus": "documented",
      "variant": "Tony DeBlase Leather Pride flag, 1989"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Leather_subculture"
      ],
      "evidence": "Article describes leather-related subculture and LGBTQ historical context."
    }
  },
  {
    "id": "straight-ally",
    "label": "Straight Ally",
    "words": [
      "straight ally",
      "lgbtq ally",
      "lgbtq allies"
    ],
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000",
      "#FFFFFF",
      "#E40303",
      "#FF8C00",
      "#FFED00",
      "#008026",
      "#004DFF",
      "#750787",
      "#FFFFFF",
      "#000000",
      "#FFFFFF",
      "#000000"
    ],
    "definition": "A heterosexual person who actively supports LGBTQ equality.",
    "category": "Community term",
    "sources": [
      "https://pflag.org/glossary/",
      "https://www.bloomingtonpridemn.org/pride-flags",
      "https://en.wikipedia.org/wiki/Straight_ally"
    ],
    "flag": {
      "status": "legacy",
      "note": "Pride organization documents this ally flag.",
      "sources": [
        "https://www.bloomingtonpridemn.org/pride-flags"
      ],
      "reviewStatus": "documented",
      "variant": "Black-and-white stripes with rainbow A"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Straight_ally"
      ],
      "evidence": "Article defines heterosexual/cisgender support for LGBTQ civil rights and equality."
    },
    "recognitionNote": "The retained recognition term ally can describe supporters of any orientation. The selected flag is specifically a straight-ally design."
  },
  {
    "id": "questioning",
    "label": "Questioning",
    "words": [
      "questioning",
      "unsure of gender"
    ],
    "colors": [
      "#FF75A2",
      "#DDDDDD",
      "#9C59D1",
      "#2C2C2C",
      "#5BCEFA"
    ],
    "definition": "Exploring or reconsidering sexual orientation, gender identity or expression.",
    "category": "Gender identity",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Questioning_(sexuality_and_gender)"
    ],
    "flag": {
      "status": "legacy",
      "note": "Indexed wiki distinguishes a general questioning proposal from gender-only questioning flags.",
      "sources": [
        "https://lgbtqidentity.wikitide.org/wiki/Questioning"
      ],
      "reviewStatus": "documented",
      "variant": "ProtegoEtServio 2016 proposal"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Questioning_(sexuality_and_gender)"
      ],
      "evidence": "Lead defines exploring sexual orientation, sexual identity or gender while unsure about applying labels."
    }
  },
  {
    "id": "altersex",
    "label": "Altersex",
    "words": [
      "altersex"
    ],
    "colors": [],
    "category": "Sex characteristics",
    "definition": "A term for having or wanting sex characteristics outside typical binary patterns, distinguished from being born intersex.",
    "sources": [
      "https://gender.fandom.com/wiki/Altersex"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "French community wiki documents mint, blue, white, purple and pink flag.",
      "sources": [
        "https://lgbtqia.fandom.com/fr/wiki/Altersexe"
      ],
      "reviewStatus": "documented",
      "variant": "Pastelmemer proposal, May 2017"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "androx",
    "label": "Androx",
    "words": [
      "androx"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A gender described as between male and androgyne.",
    "sources": [
      "https://queer-dictionary.crd.co/"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "An image is placed directly under the Androx entry.",
      "sources": [
        "https://queer-dictionary.crd.co/"
      ],
      "reviewStatus": "documented",
      "variant": "Community glossary illustration"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "anesigender",
    "label": "Anesigender",
    "words": [
      "anesigender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Experiencing one gender while feeling comfortable identifying with another.",
    "sources": [
      "https://www.accessmhct.com/wp-content/uploads/sites/4/2021/09/ACCESS-MH-Peds-Gender-Talk-1022021-copy.pdf"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "No stable public creator or educational flag documentation located.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "apagender",
    "label": "Apagender",
    "words": [
      "apagender",
      "gender apathetic"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Having little concern about which gender others perceive or assign to you.",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://queer-dictionary.crd.co/",
      "https://en.wikipedia.org/wiki/Agender#Gender_apathetic"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Image directly accompanies the Apagender/Gender Apathetic entry.",
      "sources": [
        "https://queer-dictionary.crd.co/"
      ],
      "reviewStatus": "documented",
      "variant": "Community glossary illustration"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Agender#Gender_apathetic"
      ],
      "evidence": "Section explicitly equates apagender with gender apathy and explains indifference to gender identity and gendered comments."
    }
  },
  {
    "id": "boy",
    "label": "Boy",
    "words": [
      "boy"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A male child or young person; also used as a gender self-description.",
    "sources": [
      "https://en.wikipedia.org/wiki/Boy",
      "https://unece.org/sites/default/files/2025-04/B-1%20Sex%20and%20gender%20identity%20indicators%20in%20surveys%20%28Italy%29_1.pdf"
    ],
    "contextTerms": [
      "boy"
    ],
    "flag": {
      "status": "unverified",
      "note": "No distinct broadly documented Boy flag verified.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Boy"
      ],
      "evidence": "Article supports the ordinary male-child/young-person meaning; it does not establish a distinct pride identity or flag."
    }
  },
  {
    "id": "boyflux",
    "label": "Boyflux",
    "words": [
      "boyflux"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A gender whose masculine intensity varies over time.",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Genderflux"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Public media category lists several named Boyflux flag variants.",
      "sources": [
        "https://nonbinary.wiki/wiki/Category:Boyflux_pride_flags"
      ],
      "reviewStatus": "documented",
      "variant": "Multiple Boyflux proposals"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "cisgender",
    "label": "Cisgender",
    "words": [
      "cisgender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Having a gender identity that aligns with sex assigned at birth.",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Cisgender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Commons labels the file a cisgender flag, vector by Nikki in 2021.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Cisgender_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Commons cisgender flag proposal"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Cisgender"
      ],
      "evidence": "Definition describes alignment between assigned sex/gender and personal gender identity."
    }
  },
  {
    "id": "cis-man",
    "label": "Cis Man",
    "words": [
      "cis man",
      "cisgender man",
      "cis male",
      "cisgender male"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A man whose gender identity aligns with being assigned male at birth.",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Cisgender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Indexed page labels a cis-man flag image.",
      "sources": [
        "https://queerdom.fandom.com/wiki/Cisgender"
      ],
      "reviewStatus": "documented",
      "variant": "Community wiki cis-man illustration"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Cisgender"
      ],
      "evidence": "Definitions section explicitly explains cis male and analogous cis man as male assigned male at birth."
    }
  },
  {
    "id": "cis-woman",
    "label": "Cis Woman",
    "words": [
      "cis woman",
      "cisgender woman",
      "cis female",
      "cisgender female"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A woman whose gender identity aligns with being assigned female at birth.",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Cisgender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Indexed page labels a cis-woman flag image.",
      "sources": [
        "https://queerdom.fandom.com/wiki/Cisgender"
      ],
      "reviewStatus": "documented",
      "variant": "Community wiki cis-woman illustration"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Cisgender"
      ],
      "evidence": "Definitions section explicitly explains cis female and analogous cis woman as female assigned female at birth."
    }
  },
  {
    "id": "crossdresser",
    "label": "Crossdresser/Transvestite",
    "words": [
      "crossdresser",
      "cross-dresser",
      "transvestite"
    ],
    "colors": [],
    "category": "Gender expression",
    "definition": "Someone who wears clothing culturally associated with another gender.",
    "sources": [
      "https://en.wikipedia.org/wiki/Cross-dressing"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Public CSD publication documents the crossdresser flag designed for Magdeburg remembrance.",
      "sources": [
        "https://csd-deutschland.de/wp-content/uploads/2022/03/WEB_Queerstimme-CSD-DE-2022.pdf"
      ],
      "reviewStatus": "documented",
      "variant": "Iryna Neklyudova / Magdeburg crossdresser flag, 2022"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Cross-dressing"
      ],
      "evidence": "Article defines wearing clothing associated with another gender and distinguishes expression from orientation."
    }
  },
  {
    "id": "demifemme",
    "label": "DemiFemme",
    "words": [
      "demifemme",
      "demifeminine"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A partial connection to femininity alongside a gender experience outside the binary.",
    "sources": [
      "https://youthrex.com/wp-content/uploads/2020/10/Queer-Glossary_2022_Digital.pdf"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Demigirl flag pages mention demifemme, but a distinct demifemme flag was not independently verified.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "demimasc",
    "label": "Demimasc",
    "words": [
      "demimasc",
      "demimasculine"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A partial connection to masculinity alongside a gender experience outside the binary.",
    "sources": [
      "https://gender.fandom.com/wiki/Demimasc",
      "https://youthrex.com/wp-content/uploads/2020/10/Queer-Glossary_2022_Digital.pdf"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Wiki documents the flag and links the original creator post, which was unavailable in this browser.",
      "sources": [
        "https://gender.fandom.com/wiki/Demimasc"
      ],
      "reviewStatus": "documented",
      "variant": "Shewhowalkswiththee proposal, October 2018"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    },
    "recognitionNote": "Demimasc and demimasculine have differing definitions in some references. This recognition group retains both terms; their use is not always interchangeable."
  },
  {
    "id": "eunuch",
    "label": "Eunuch",
    "words": [
      "eunuch"
    ],
    "colors": [],
    "category": "Sex characteristics",
    "definition": "A historical and sometimes self-chosen term associated with castration and, in some cultures, a distinct social or gender role.",
    "sources": [
      "https://en.wikipedia.org/wiki/Eunuch"
    ],
    "contextTerms": [
      "eunuch"
    ],
    "flag": {
      "status": "unverified",
      "note": "A Sekhet-specific proposal was located, but not verified as a generic eunuch flag.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Eunuch"
      ],
      "evidence": "Historical article supports castration-associated use and varied social roles, including non-castrated historical categories."
    }
  },
  {
    "id": "faunetflux",
    "label": "Faunetflux",
    "words": [
      "faunetflux"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A fluid and fluctuating gender experience that can include feminine genders without being fully a woman.",
    "sources": [
      "https://gender.fandom.com/f/t/Faunetflux"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Indexed topic identifies a corresponding flag, but the main article returned a fetch error.",
      "sources": [
        "https://gender.fandom.com/f/t/Faunetflux"
      ],
      "reviewStatus": "documented",
      "variant": "Community wiki Faunetflux illustration"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "female",
    "label": "Female",
    "words": [
      "female"
    ],
    "colors": [],
    "category": "Sex or gender term",
    "definition": "A term used for sex classification and, in some contexts, a person’s gender self-description.",
    "sources": [
      "https://interactadvocates.org/faq/",
      "https://en.wikipedia.org/wiki/Intersex"
    ],
    "contextTerms": [
      "female"
    ],
    "flag": {
      "status": "unverified",
      "note": "No general Female flag independently verified.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Intersex"
      ],
      "evidence": "Article distinguishes sex classification from gender identity and discusses female self-identification. Supports contextual use, not equating identity with anatomy."
    }
  },
  {
    "id": "femboy",
    "label": "Femboy/femboi",
    "words": [
      "femboy",
      "femboi"
    ],
    "colors": [],
    "category": "Gender expression",
    "definition": "A usually male-identified person with a feminine style or expression.",
    "sources": [
      "https://en.wikipedia.org/wiki/Femboy"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Article describes a seven-stripe pink, pale-pink, white and blue flag.",
      "sources": [
        "https://en.wikipedia.org/wiki/Femboy"
      ],
      "reviewStatus": "documented",
      "variant": "Seven-stripe femboy proposal"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Femboy"
      ],
      "evidence": "Lead and definitions describe feminine presentation among usually male individuals without specifying orientation."
    }
  },
  {
    "id": "futch",
    "label": "Futch",
    "words": [
      "futch"
    ],
    "colors": [],
    "category": "Gender expression",
    "definition": "An identity or presentation combining aspects of butch and femme.",
    "sources": [
      "https://lgbt.fandom.com/es/wiki/Futch",
      "https://en.wikipedia.org/wiki/Butch_and_femme"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Wiki attributes a combined butch/femme design to this creator.",
      "sources": [
        "https://lgbt.fandom.com/es/wiki/Futch"
      ],
      "reviewStatus": "documented",
      "variant": "Spencer Hastings / Wellick proposal, 2017"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Butch_and_femme"
      ],
      "evidence": "Terminology paragraph explicitly defines futch as combining butch and femme characteristics."
    }
  },
  {
    "id": "gender-anarchist",
    "label": "Gender Anarchist",
    "words": [
      "gender anarchist"
    ],
    "colors": [],
    "category": "Gender expression",
    "definition": "A self-description associated with rejecting imposed gender rules and hierarchies.",
    "sources": [
      "https://c4ss.org/content/54814"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "No sufficiently documented corresponding flag located.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "gender-neutral",
    "label": "Gender Neutral",
    "words": [
      "gender neutral",
      "gender-neutral"
    ],
    "colors": [],
    "category": "Gender identity or expression",
    "definition": "A neutral gender identity or expression; the term also describes language and spaces that do not specify gender.",
    "sources": [
      "https://nonbinary.wiki/wiki/Gender_Neutral"
    ],
    "contextTerms": [
      "gender neutral",
      "gender-neutral"
    ],
    "flag": {
      "status": "unverified",
      "note": "Page documents two 2016 enbygsrd proposals and another unattributed design.",
      "sources": [
        "https://nonbinary.wiki/wiki/Gender_Neutral"
      ],
      "reviewStatus": "documented",
      "variant": "Multiple gender-neutral proposals"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "gender-nonconforming",
    "label": "Gender Non-Conforming",
    "words": [
      "gender nonconforming",
      "gender non-conforming",
      "gender-nonconforming"
    ],
    "colors": [
      "#8B17B3",
      "#FFFFFF",
      "#8B17B3"
    ],
    "category": "Gender expression",
    "definition": "Expressing gender outside a culture’s expected norms.",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Gender_nonconformity"
    ],
    "contextTerms": [],
    "flag": {
      "status": "verified",
      "note": "Creator identifies the purpose; original Commons SVG read, with 200/100/200 band heights.",
      "sources": [
        "https://www.freedressing.org/pride_flag.html",
        "https://commons.wikimedia.org/wiki/File:Gendercreative_pride_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Leslie Krause Gender Creative Pride flag, 2015",
      "source": "https://www.freedressing.org/pride_flag.html"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Gender_nonconformity"
      ],
      "evidence": "Article explains expression and behavior differing from culturally expected gender norms."
    }
  },
  {
    "id": "gender-questioning",
    "label": "Gender Questioning",
    "words": [
      "gender questioning"
    ],
    "colors": [],
    "category": "Gender exploration",
    "definition": "Exploring or reconsidering one’s gender identity or expression.",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Questioning_(sexuality_and_gender)"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Commons identifies the designer and gender-questioning flag.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Gender_questioning_flag.png"
      ],
      "reviewStatus": "documented",
      "variant": "Enbygsrd proposal, September 2016"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Questioning_(sexuality_and_gender)"
      ],
      "evidence": "Lead explicitly includes exploration of gender, not only sexuality."
    }
  },
  {
    "id": "genderfuck",
    "label": "Genderfuck",
    "words": [
      "genderfuck",
      "gender-fuck"
    ],
    "colors": [],
    "category": "Gender expression",
    "definition": "Deliberately challenging or mixing conventional gender categories through identity or expression.",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Gender_bender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Indexed community wiki documents a purple field with a skull motif.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Genderfuck"
      ],
      "reviewStatus": "documented",
      "variant": "Jasper / yo-ho-sebastian proposal"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Gender_bender"
      ],
      "evidence": "Lead explicitly calls bending expected gender roles genderfuck and describes challenging restrictive norms."
    }
  },
  {
    "id": "genderless",
    "label": "Genderless",
    "words": [
      "genderless"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Experiencing no gender or a lack of gender.",
    "sources": [
      "https://queer-dictionary.crd.co/",
      "https://nonbinary.wiki/wiki/Genderless",
      "https://en.wikipedia.org/wiki/Agender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Glossary explicitly includes a Genderless image separate from its Agender image.",
      "sources": [
        "https://queer-dictionary.crd.co/"
      ],
      "reviewStatus": "documented",
      "variant": "Community glossary genderless illustration"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Agender"
      ],
      "evidence": "Lead explicitly lists genderless as lack-of-gender terminology."
    }
  },
  {
    "id": "girl",
    "label": "Girl",
    "words": [
      "girl"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A female child or young person; also used as a gender self-description.",
    "sources": [
      "https://en.wikipedia.org/wiki/Girl",
      "https://unece.org/sites/default/files/2025-04/B-1%20Sex%20and%20gender%20identity%20indicators%20in%20surveys%20%28Italy%29_1.pdf"
    ],
    "contextTerms": [
      "girl"
    ],
    "flag": {
      "status": "unverified",
      "note": "No distinct broadly documented Girl flag verified.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Girl"
      ],
      "evidence": "Article supports the ordinary female-child/young-person meaning; it does not establish a distinct pride identity or flag."
    }
  },
  {
    "id": "girlflux",
    "label": "Girlflux",
    "words": [
      "girlflux"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A gender whose feminine intensity varies over time.",
    "sources": [
      "https://gender.fandom.com/wiki/Girlflux"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Wiki documents this flag and several alternatives.",
      "sources": [
        "https://gender.fandom.com/wiki/Girlflux"
      ],
      "reviewStatus": "documented",
      "variant": "Kitsuneshay proposal, August 2015"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "glitchgender",
    "label": "Glitchgender",
    "words": [
      "glitchgender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A community term for a gender experienced as glitch-like or difficult to make sense of.",
    "sources": [
      "https://nonbinary.wiki/wiki/User:TheZoodles/Draft"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Search located mirrors and informal alternative proposals, without a sufficiently verified public original.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference-pending",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "graygender",
    "label": "Graygender",
    "words": [
      "graygender",
      "greygender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A weak or ambivalent connection to gender. ",
    "sources": [
      "https://www.healthline.com/health/different-genders"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Indexed article links a 2015 Pride-Flags upload; another wiki attributes design to Invernom.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Graygender"
      ],
      "reviewStatus": "documented",
      "variant": "Common graygender community flag"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "gynx",
    "label": "Gynx",
    "words": [
      "gynx"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A gender described as between female and androgyne.",
    "sources": [
      "https://cupidpride.wordpress.com/2018/01/11/opalescentorbisian-gynx-a-gender-inbetween/",
      "https://queer-dictionary.crd.co/"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Post shows two designs and identifies the first as the author’s main design.",
      "sources": [
        "https://cupidpride.wordpress.com/2018/01/11/opalescentorbisian-gynx-a-gender-inbetween/"
      ],
      "reviewStatus": "documented",
      "variant": "Opalescentorbisian designs, archived public reblog January 2018"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "hijra",
    "label": "Hijra",
    "words": [
      "hijra"
    ],
    "colors": [
      "#FFCCE6",
      "#FFFFFF",
      "#C10000",
      "#FFFFFF",
      "#B9E0FB"
    ],
    "category": "Cultural identity",
    "definition": "A culturally specific South Asian identity and community with distinct gender and social traditions.",
    "sources": [
      "https://en.wikipedia.org/wiki/Hijra_(South_Asia)"
    ],
    "contextTerms": [],
    "flag": {
      "status": "verified",
      "note": "Original Commons SVG read; top-to-bottom bands verified.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Hijra_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Samira / FloralFemmes proposed Hijra flag",
      "source": "https://commons.wikimedia.org/wiki/File:Hijra_flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Hijra_(South_Asia)"
      ],
      "evidence": "Article supports culturally specific South Asian gender/community identity. Article carries quality concerns; verification mark should indicate source coverage, not blanket reliability."
    }
  },
  {
    "id": "intersex-female",
    "label": "Intersex Female",
    "words": [
      "intersex female",
      "intersex woman"
    ],
    "colors": [],
    "category": "Sex characteristics and gender",
    "definition": "An intersex person who identifies as female.",
    "sources": [
      "https://interactadvocates.org/faq/",
      "https://en.wikipedia.org/wiki/Intersex#Legal_recognition"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "No distinct intersex-female flag independently verified.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Intersex#Legal_recognition"
      ],
      "evidence": "Section explicitly discusses intersex people who self-describe as female/women; supports the compositional definition."
    }
  },
  {
    "id": "intersex-male",
    "label": "Intersex Male",
    "words": [
      "intersex male",
      "intersex man"
    ],
    "colors": [],
    "category": "Sex characteristics and gender",
    "definition": "An intersex person who identifies as male.",
    "sources": [
      "https://interactadvocates.org/faq/",
      "https://en.wikipedia.org/wiki/Intersex#Legal_recognition"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "No distinct intersex-male flag independently verified.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Intersex#Legal_recognition"
      ],
      "evidence": "Section explicitly discusses intersex people who self-describe as male/men; supports the compositional definition."
    }
  },
  {
    "id": "male",
    "label": "Male",
    "words": [
      "male"
    ],
    "colors": [],
    "category": "Sex or gender term",
    "definition": "A sex-category term; it is distinct from the gender identity man.",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Male"
    ],
    "contextTerms": [
      "male"
    ],
    "flag": {
      "status": "unverified",
      "note": "Page credits creator and publication on 18 September 2020; not automatically a man flag.",
      "sources": [
        "https://new.lgbtqia.wiki/wiki/Male"
      ],
      "reviewStatus": "documented",
      "variant": "Queerflagswithbenton 2020 proposed male flag"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Male"
      ],
      "evidence": "Article distinguishes biological sex usage from gender-role/identity usage. Catalog term is identified, but categorical wording that male is always distinct from man is too absolute."
    }
  },
  {
    "id": "man",
    "label": "Man",
    "words": [
      "man"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A gender identity that includes cisgender and transgender men.",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Man"
    ],
    "contextTerms": [
      "man"
    ],
    "flag": {
      "status": "unverified",
      "note": "No sufficiently supported flag specific to this exact catalog entry found in this review. Related identity or umbrella flags were not silently substituted.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Man"
      ],
      "evidence": "Article covers men as a gender and explicitly includes transgender men."
    }
  },
  {
    "id": "masc",
    "label": "Masc",
    "words": [
      "masc"
    ],
    "colors": [],
    "category": "Gender expression",
    "definition": "Short for masculine; used for masculine expression or identity.",
    "sources": [
      "https://en.wiktionary.org/wiki/masc"
    ],
    "contextTerms": [
      "masc"
    ],
    "flag": {
      "status": "unverified",
      "note": "No sufficiently supported flag specific to this exact catalog entry found in this review. Related identity or umbrella flags were not silently substituted.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "mullerian",
    "label": "Müllerian",
    "words": [
      "müllerian",
      "mullerian"
    ],
    "colors": [],
    "category": "Sex characteristics",
    "definition": "A community sex descriptor referring to development of the Müllerian ducts.",
    "sources": [
      "https://beyond-mogai-pride-flags.tumblr.com/post/737626793265217536/werwolffian-pride-flag"
    ],
    "contextTerms": [
      "müllerian",
      "mullerian"
    ],
    "flag": {
      "status": "unverified",
      "note": "Creator-linked Wolffian/Müllerian pair discovered through Wolffian source, but Müllerian design not independently inspected.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "multigender",
    "label": "Multigender",
    "words": [
      "multigender",
      "multi-gender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "An umbrella for experiencing more than one gender.",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Multigender",
      "https://en.wikipedia.org/wiki/Non-binary#Polygender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Wiki documents use by January 2016; creator and meanings unresolved.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Multigender"
      ],
      "reviewStatus": "documented",
      "variant": "Five-stripe proposed multigender design"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary#Polygender"
      ],
      "evidence": "Polygender section identifies multigender as experiencing multiple genders."
    }
  },
  {
    "id": "musicgender",
    "label": "Musicgender",
    "words": [
      "musicgender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Gender described through musical theory, rather than a particular music genre.",
    "sources": [
      "https://lgbt.fandom.com/es/wiki/Musicg%C3%A9nero"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Article displays main and alternate designs; original asset colors unverified.",
      "sources": [
        "https://lgbt.fandom.com/es/wiki/Musicg%C3%A9nero"
      ],
      "reviewStatus": "documented",
      "variant": "Musicgender flag and alternatives"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "neogender",
    "label": "Neogender",
    "words": [
      "neogender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "An umbrella for recently coined gender labels, often those coined since 2000.",
    "sources": [
      "https://gend3r.com/index.php/Neogender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Page documents green and yellow versions; meanings unknown.",
      "sources": [
        "https://gend3r.com/index.php/Neogender"
      ],
      "reviewStatus": "documented",
      "variant": "Green neogender flag by rando-pride-flags"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "omnigender",
    "label": "Omnigender",
    "words": [
      "omnigender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Experiencing many or all genders; distinctions from pangender vary.",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Pangender",
      "https://en.wikipedia.org/wiki/List_of_gender_identities#O"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "University page displays an omnigender flag; distinguishes its account from pangender.",
      "sources": [
        "https://www.wpi.edu/offices/diversity/student-resources/lgbtqiap-student-support/lgbtqiap-flags-terms"
      ],
      "reviewStatus": "documented",
      "variant": "Omnigender design in WPI educational guide"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/List_of_gender_identities#O"
      ],
      "evidence": "Explicitly listed under O; this page does not establish the catalog definition or its relationship to pangender."
    }
  },
  {
    "id": "paraboy",
    "label": "Paraboy",
    "words": [
      "paraboy"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Identifying mostly, but not entirely, as a boy or man.",
    "sources": [
      "https://new.lgbtqia.wiki/wiki/Paraboy"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Page displays a flag under this term; provenance and exact palette unresolved.",
      "sources": [
        "https://lgbtqia.fandom.com/fr/wiki/Paraboy"
      ],
      "reviewStatus": "documented",
      "variant": "Paraboy flag in French wiki"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "paragirl",
    "label": "Paragirl",
    "words": [
      "paragirl"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Identifying mostly, but not entirely, as a girl or woman.",
    "sources": [
      "https://new.lgbtqia.wiki/wiki/Paragender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Specific entry documents creator/date and gray/white/orange/pink-center design; cites exact pridearchive post 92689899026.",
      "sources": [
        "https://gender.fandom.com/wiki/Paragirl"
      ],
      "reviewStatus": "documented",
      "variant": "Pridearchive 2014 paragirl design"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "pivotgender",
    "label": "Pivotgender",
    "words": [
      "pivotgender",
      "expecgender",
      "swivelgender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Gender that changes depending on the people present.",
    "sources": [
      "https://gender.fandom.com/wiki/Mirrorgender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Page names aliases and gray/yellow/pink/blue meanings; original designer unknown.",
      "sources": [
        "https://prideflag.fandom.com/wiki/Pivotgender_Flag"
      ],
      "reviewStatus": "documented",
      "variant": "Pridearchive pivotgender design"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "pupgender",
    "label": "Pupgender",
    "words": [
      "pupgender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A xenogender described through puppy-like qualities or connection to puppies.",
    "sources": [
      "https://nonbinary.wiki/wiki/Pupgender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Both designs documented separately with creator reference links; emblem geometry matters.",
      "sources": [
        "https://queer-community.fandom.com/wiki/Pupgender"
      ],
      "reviewStatus": "documented",
      "variant": "Kandipaws design and viraldoll alternate"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "queer-femme",
    "label": "Queer Femme",
    "words": [
      "queer femme"
    ],
    "colors": [],
    "category": "Gender expression",
    "definition": "A queer self-description connected to femme identity or expression.",
    "sources": [
      "https://en.wikipedia.org/wiki/Femme"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "No sufficiently supported flag specific to this exact catalog entry found in this review. Related identity or umbrella flags were not silently substituted.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Femme"
      ],
      "evidence": "Article explicitly discusses queer femme identity, including uses not dependent on feminine aesthetics."
    }
  },
  {
    "id": "salmacian",
    "label": "Salmacian",
    "words": [
      "salmacian"
    ],
    "colors": [],
    "category": "Embodiment identity",
    "definition": "A self-description for people who desire mixed genital anatomy.",
    "sources": [
      "https://salmacian.org/"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Community homepage distinguishes blue/light-blue/purple/light-green/green design and Erikatharsis alternate.",
      "sources": [
        "https://salmacian.org/"
      ],
      "reviewStatus": "documented",
      "variant": "Anonymous 2016 five-stripe design; Sign of Salmacis alternate"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "tomboy",
    "label": "Tomboy",
    "words": [
      "tomboy"
    ],
    "colors": [],
    "category": "Gender expression",
    "definition": "A girl or woman with expression or interests culturally associated with masculinity.",
    "sources": [
      "https://en.wikipedia.org/wiki/Tomboy"
    ],
    "contextTerms": [
      "tomboy"
    ],
    "flag": {
      "status": "unverified",
      "note": "Page documents blue/brown/white/pink stripes and a distinct mascgirl alternate.",
      "sources": [
        "https://neuroqueer.fandom.com/fr/wiki/Tomboy"
      ],
      "reviewStatus": "documented",
      "variant": "2017 tomboy design"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Tomboy"
      ],
      "evidence": "Lead defines a girl or young woman with traits or behaviors culturally associated with boys and men."
    }
  },
  {
    "id": "trans-man",
    "label": "Trans Man",
    "words": [
      "trans man",
      "transgender man",
      "trans men",
      "transgender men"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A man who is transgender.",
    "sources": [
      "https://pflag.org/glossary/",
      "https://en.wikipedia.org/wiki/Trans_man"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Creator explicitly distinguishes proposal from transmasculine umbrella flag.",
      "sources": [
        "https://www.reddit.com/r/QueerVexillology/comments/v7scfp/ftmtrans_man_pride_flag_made_by_me/"
      ],
      "reviewStatus": "documented",
      "variant": "Creator-proposed 2022 trans-man flag"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Trans_man"
      ],
      "evidence": "Lead identifies a man assigned female at birth and describes male gender identity."
    }
  },
  {
    "id": "trans-non-binary",
    "label": "Trans Non-Binary",
    "words": [
      "trans non-binary",
      "trans nonbinary",
      "transgender nonbinary",
      "transgender non-binary"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A person who identifies as both transgender and nonbinary.",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Transgender",
      "https://en.wikipedia.org/wiki/Non-binary"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Article gallery explicitly identifies a trans nonbinary flag by unknown creator.",
      "sources": [
        "https://queerplus.wikioasis.org/wiki/Nonbinary"
      ],
      "reviewStatus": "documented",
      "variant": "Trans-nonbinary design, creator unknown"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary"
      ],
      "evidence": "Article documents overlapping transgender and nonbinary identities without requiring all nonbinary people to identify as transgender."
    }
  },
  {
    "id": "trans-woman",
    "label": "Trans Woman",
    "words": [
      "trans woman",
      "transgender woman",
      "trans women",
      "transgender women"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A woman who is transgender.",
    "sources": [
      "https://gender.fandom.com/wiki/Trans_Woman",
      "https://en.wikipedia.org/wiki/Trans_woman"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Main and alternate designs are identified in gallery.",
      "sources": [
        "https://gender.fandom.com/wiki/Trans_Woman"
      ],
      "reviewStatus": "documented",
      "variant": "Trans-woman flag attributed to Pride-Flags"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Trans_woman"
      ],
      "evidence": "Lead identifies a woman assigned male at birth."
    }
  },
  {
    "id": "transine",
    "label": "Transine",
    "words": [
      "transine"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A community term for a trans or nonbinary identity without desired medical transition; usage varies.",
    "sources": [],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "No sufficiently supported flag specific to this exact catalog entry found in this review. Related identity or umbrella flags were not silently substituted.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference-pending",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "transsexual",
    "label": "Transsexual",
    "words": [
      "transsexual",
      "transsex"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A historical self-description some people retain, often emphasizing sex or transition; not a label to impose.",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Transsexual#Terminology"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Flags of the World documents a design under Transsexual flag, but its historical correction explicitly says Johnathan Andrew intended it for transgender people generally. No exclusively transsexual design certified.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Transsexual#Terminology"
      ],
      "evidence": "Terminology section documents historical use and people who retain this self-description while others reject it."
    }
  },
  {
    "id": "versandrogyne",
    "label": "Versandrogyne",
    "words": [
      "versandrogyne"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "An androgyne whose balance of femininity and masculinity fluctuates.",
    "sources": [
      "https://beyond-mogai-pride-flags.tumblr.com/post/179943829185/versandrogynous-pride-flag"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Primary definition/flag post; exact asset palette not extracted.",
      "sources": [
        "https://beyond-mogai-pride-flags.tumblr.com/post/179943829185/versandrogynous-pride-flag"
      ],
      "reviewStatus": "documented",
      "variant": "2018 Versandrogynous design"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "voidboy",
    "label": "Voidboy",
    "words": [
      "voidboy"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "In one usage, gendervoid with a slight connection to boyhood.",
    "sources": [
      "https://www.reddit.com/r/XenogendersAndMore/comments/ypxbkp/"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Unresolved for the catalog definition. Gallery identifies both flags, but this applies to plurality meaning, not automatically the 2022 gendervoid interpretation.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "voidgirl",
    "label": "Voidgirl",
    "words": [
      "voidgirl"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "In one usage, gendervoid with a slight connection to girlhood.",
    "sources": [
      "https://www.reddit.com/r/XenogendersAndMore/comments/ypxbkp/"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Unresolved for the catalog definition. Gallery identifies both flags, but this applies to plurality meaning, not automatically the 2022 gendervoid interpretation.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "wolffian",
    "label": "Wolffian",
    "words": [
      "wolffian"
    ],
    "colors": [],
    "category": "Sex characteristics",
    "definition": "A community sex descriptor referring to development of the Wolffian ducts.",
    "sources": [
      "https://beyond-mogai-pride-flags.tumblr.com/post/737626793265217536/werwolffian-pride-flag"
    ],
    "contextTerms": [
      "wolffian"
    ],
    "flag": {
      "status": "unverified",
      "note": "Page credits flag and symbol to 31 August 2021 and links original archived post.",
      "sources": [
        "https://queerdom.fandom.com/wiki/Wolffian"
      ],
      "reviewStatus": "documented",
      "variant": "Mourningmogaicrew 2021 design"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "woman",
    "label": "Woman",
    "words": [
      "woman"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A gender identity that includes cisgender and transgender women.",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Woman"
    ],
    "contextTerms": [
      "woman"
    ],
    "flag": {
      "status": "unverified",
      "note": "No sufficiently supported flag specific to this exact catalog entry found in this review. Related identity or umbrella flags were not silently substituted.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Woman"
      ],
      "evidence": "Article includes cisgender and transgender women and distinguishes assigned sex from affirmed gender."
    }
  },
  {
    "id": "xenogender",
    "label": "Xenogender",
    "words": [
      "xenogender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Gender described using concepts beyond conventional male and female categories.",
    "sources": [
      "https://nonbinary.wiki/index.php?mobileaction=toggle_view_mobile&title=Catgender",
      "https://en.wikipedia.org/wiki/Non-binary#Xenogender"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "File record links imoga-pride post and December 2020 upload.",
      "sources": [
        "https://nonbinary.wiki/index.php?title=File%3AXenogender_without_symbol.png"
      ],
      "reviewStatus": "documented",
      "variant": "Xenogender design without symbol"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Non-binary#Xenogender"
      ],
      "evidence": "Section describes gender through concepts outside conventional male/female categories, including nature and abstract concepts."
    }
  },
  {
    "id": "xxy",
    "label": "XXY",
    "words": [
      "XXY"
    ],
    "colors": [],
    "category": "Sex characteristics",
    "definition": "A chromosome pattern with two X chromosomes and one Y chromosome.",
    "sources": [
      "https://medlineplus.gov/genetics/condition/klinefelter-syndrome/",
      "https://en.wikipedia.org/wiki/XXY"
    ],
    "contextTerms": [
      "XXY"
    ],
    "flag": {
      "status": "unverified",
      "note": "2024 creator-uploaded design combines three specific symbols; not a universal XXY flag.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Trans_intersex_pride_flag_XXY.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Trans/intersex/XXY combination proposal"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/XXY"
      ],
      "evidence": "Article defines two X chromosomes and one Y chromosome. This supports a chromosome descriptor, not a gender identity."
    }
  },
  {
    "id": "aliagender",
    "label": "Aliagender",
    "words": [
      "aliagender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Gender outside existing categories.",
    "sources": [
      "https://www.healthline.com/health/different-genders"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Unresolved for the catalog definition. Secondary palette listing only; creator and variant provenance not established.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "unverified",
      "sources": [],
      "evidence": "No supporting Wikipedia or peer-reviewed reference confirmed in this review."
    }
  },
  {
    "id": "aporagender",
    "label": "Aporagender",
    "words": [
      "aporagender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "A distinct gender beyond male, female, or their combination.",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/List_of_gender_identities#A"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Page names creator and explains blue/pink/purple/yellow meanings.",
      "sources": [
        "https://gend3r.com/index.php/Aporagender"
      ],
      "reviewStatus": "documented",
      "variant": "Hyaenahart aporagender design"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/List_of_gender_identities#A"
      ],
      "evidence": "Explicitly listed with citations under A; membership does not establish the entire definition."
    }
  },
  {
    "id": "gendervoid",
    "label": "Gendervoid",
    "words": [
      "gendervoid"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Gender experienced as absent or empty.",
    "sources": [
      "https://www.healthline.com/health/different-genders",
      "https://en.wikipedia.org/wiki/Agender#Gendervoid"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Dictionary article displays flag with credit; does not establish exact palette or original designer.",
      "sources": [
        "https://www.dictionary.com/culture/gender-sexuality/gendervoid"
      ],
      "reviewStatus": "documented",
      "variant": "Gendervoid design attributed to Pride-Flags"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Agender#Gendervoid"
      ],
      "evidence": "Section describes an absence of gender experience or identity."
    }
  },
  {
    "id": "intergender",
    "label": "Intergender",
    "words": [
      "intergender"
    ],
    "colors": [],
    "category": "Gender identity",
    "definition": "Gender between male and female; some use it specifically for gender shaped by being intersex.",
    "sources": [
      "https://nonbinary.wiki/wiki/Intergender",
      "https://en.wikipedia.org/wiki/List_of_gender_identities#I"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Yellow/purple design with white circle, explicitly distinguished from older striped 2014 variants.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Intergender"
      ],
      "reviewStatus": "documented",
      "variant": "Interpunked/cripdeaf 2020 design"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/List_of_gender_identities#I"
      ],
      "evidence": "List explicitly defines an identity between male and female. It does not support the additional intersex-specific usage in the catalog wording."
    }
  },
  {
    "id": "allosexual",
    "label": "Allosexual",
    "words": [
      "allosexual"
    ],
    "colors": [
      "#FFFFFF",
      "#A9A9A9",
      "#000000",
      "#FFFFFF",
      "#000000",
      "#A9A9A9",
      "#FFFFFF"
    ],
    "category": "Sexual orientation",
    "definition": "Experiencing sexual attraction outside the asexual spectrum.",
    "sources": [
      "https://en.wikipedia.org/wiki/Allosexuality"
    ],
    "contextTerms": [],
    "flag": {
      "status": "verified",
      "note": "Raw SVG inspected: nested white/gray/black/white shapes produce seven horizontal stripes. Revision 20 June 2021 08:28; asset https://upload.wikimedia.org/wikipedia/commons/f/f5/Allosexual_flag.svg",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Allosexual_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "2021 Commons zedsexual/allosexual representation",
      "source": "https://commons.wikimedia.org/wiki/File:Allosexual_flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Allosexuality"
      ],
      "evidence": "Lead distinguishes typical sexual attraction from the asexual spectrum and notes that frequency is not specified."
    }
  },
  {
    "id": "androsexual",
    "label": "Androsexual",
    "words": [
      "androsexual"
    ],
    "colors": [],
    "category": "Sexual orientation",
    "definition": "Attraction to men or masculinity.",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Androphilia_and_gynephilia"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "2020 upload references 2015 Tumblr documentation; not creator-certified colors.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Androsexual_Pride_Flag.png"
      ],
      "reviewStatus": "documented",
      "variant": "Equality-universe-roy archived representation"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Androphilia_and_gynephilia"
      ],
      "evidence": "Lead defines attraction to men or masculinity; historical-use section explicitly identifies androsexual as a synonym."
    }
  },
  {
    "id": "autosexual",
    "label": "Autosexual",
    "words": [
      "autosexual"
    ],
    "colors": [],
    "category": "Sexual orientation",
    "definition": "Sexual attraction directed toward oneself.",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Autosexuality"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "File has raster content rather than SVG fills; palette not extracted.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Autosexual_pride_flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "Kautr 2021 raster-wrapped representation"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Autosexuality"
      ],
      "evidence": "Lead defines attraction primarily directed toward oneself."
    }
  },
  {
    "id": "autoromantic",
    "label": "Autoromantic",
    "words": [
      "autoromantic"
    ],
    "colors": [],
    "category": "Romantic orientation",
    "definition": "Romantic attraction directed toward oneself.",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Autosexuality"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Describes blue/gray flag with green heart and black arrow outline; cannot be faithfully expressed as stripe palette alone.",
      "sources": [
        "https://queerdom.fandom.com/wiki/Autoromantic"
      ],
      "reviewStatus": "documented",
      "variant": "Pride-Flags 2017 representation"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Autosexuality"
      ],
      "evidence": "Lead explicitly identifies autoromanticism as the romantic equivalent."
    }
  },
  {
    "id": "biromantic",
    "label": "Biromantic",
    "words": [
      "biromantic"
    ],
    "colors": [],
    "category": "Romantic orientation",
    "definition": "Romantic attraction to more than one gender.",
    "sources": [
      "https://lgbtqia.fandom.com/wiki/Biromantic",
      "https://en.wikipedia.org/wiki/Romantic_orientation#Romantic_identities"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Pale background with bisexual-colored heart; page also warns article needs rewrite.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Biromantic"
      ],
      "reviewStatus": "documented",
      "variant": "Pride-Flags 2016 heart design"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Romantic_orientation#Romantic_identities"
      ],
      "evidence": "Identity list describes romantic attraction to same and other genders, including two or more."
    }
  },
  {
    "id": "gynesexual",
    "label": "Gynesexual",
    "words": [
      "gynesexual",
      "gynosexual"
    ],
    "colors": [],
    "category": "Sexual orientation",
    "definition": "Attraction to women or femininity.",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Androphilia_and_gynephilia"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Creator and meanings unknown; Commons PNG has disputed-description notice, so no exact palette certification.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Gynesexual"
      ],
      "reviewStatus": "documented",
      "variant": "Fem-/Gyne-/Gyno- design documented 2016"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Androphilia_and_gynephilia"
      ],
      "evidence": "Lead defines attraction to women or femininity; gynephilia section explicitly identifies gynesexual as a synonym."
    }
  },
  {
    "id": "heterosexual",
    "label": "Heterosexual",
    "words": [
      "heterosexual",
      "heterosexuality"
    ],
    "colors": [
      "#000000",
      "#FFFFFF",
      "#000000",
      "#FFFFFF",
      "#000000",
      "#FFFFFF"
    ],
    "category": "Sexual orientation",
    "definition": "Attraction to a different gender.",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Heterosexuality"
    ],
    "contextTerms": [],
    "flag": {
      "status": "verified",
      "note": "Raw SVG inspected: white base and black rectangles at y=0,2,4 give six alternating stripes. Asset https://upload.wikimedia.org/wikipedia/commons/6/6a/Heterosexual_flag_%28black-white_stripes%29.svg",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Heterosexual_flag_(black-white_stripes).svg"
      ],
      "reviewStatus": "documented",
      "variant": "Nikki 2020 black/white proposal",
      "source": "https://commons.wikimedia.org/wiki/File:Heterosexual_flag_(black-white_stripes).svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Heterosexuality"
      ],
      "evidence": "Lead describes romantic or sexual attraction to a different/opposite sex or gender."
    }
  },
  {
    "id": "homosexual",
    "label": "Homosexual",
    "words": [
      "homosexual",
      "homosexuality"
    ],
    "colors": [],
    "category": "Sexual orientation",
    "definition": "Attraction to the same gender; terminology preferences vary.",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Homosexuality"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "No sufficiently supported flag specific to this exact catalog entry found in this review. Related identity or umbrella flags were not silently substituted.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Homosexuality"
      ],
      "evidence": "Lead describes romantic or sexual attraction to the same sex or gender; article also discusses terminology."
    }
  },
  {
    "id": "monosexual",
    "label": "Monosexual",
    "words": [
      "monosexual"
    ],
    "colors": [],
    "category": "Sexual orientation",
    "definition": "Attraction to one gender.",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Monosexuality"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Definition article explicitly displays a proposed monosexual flag.",
      "sources": [
        "https://lgbtqia.fandom.com/wiki/Monosexual"
      ],
      "reviewStatus": "documented",
      "variant": "Proposed monosexual design"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Monosexuality"
      ],
      "evidence": "Lead defines romantic or sexual attraction to one sex or gender."
    }
  },
  {
    "id": "panromantic",
    "label": "Panromantic",
    "words": [
      "panromantic"
    ],
    "colors": [],
    "category": "Romantic orientation",
    "definition": "Romantic attraction regardless of gender.",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Romantic_orientation#Romantic_identities"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Article distinguishes several panromantic designs; exact one/geometry must be selected before palette extraction.",
      "sources": [
        "https://mogailabel.fandom.com/wiki/Panromantic"
      ],
      "reviewStatus": "documented",
      "variant": "Pansexual-derived heart designs"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Romantic_orientation#Romantic_identities"
      ],
      "evidence": "List defines romantic attraction regardless of gender."
    }
  },
  {
    "id": "polyromantic",
    "label": "Polyromantic",
    "words": [
      "polyromantic"
    ],
    "colors": [],
    "category": "Romantic orientation",
    "definition": "Romantic attraction to multiple, not necessarily all, genders.",
    "sources": [
      "https://mogailabel.fandom.com/wiki/Panromantic",
      "https://en.wikipedia.org/wiki/Romantic_orientation#Romantic_identities"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "A public design reference is documented. The exact palette has not been verified; a neutral underline remains in use.",
      "sources": [
        "https://www.deviantart.com/pride-flags/art/Polyromantic-1-607943635"
      ],
      "reviewStatus": "documented",
      "variant": "Polyromantic (1), published by Pride-Flags in 2016"
    },
    "definitionStatus": "public-reference",
    "romantic": true,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Romantic_orientation#Romantic_identities"
      ],
      "evidence": "List defines romantic attraction to various but not all genders; catalog wording not necessarily all is broader. Use the narrower wording if claiming full Wikipedia definition support."
    }
  },
  {
    "id": "sapiosexual",
    "label": "Sapiosexual",
    "words": [
      "sapiosexual"
    ],
    "colors": [],
    "category": "Attraction descriptor",
    "definition": "Attraction centered on perceived intelligence.",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://en.wikipedia.org/wiki/Sexual_identity"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Reference shows three versions; none certified as universal.",
      "sources": [
        "https://lgbt.fandom.com/es/wiki/Sapiosexualidad"
      ],
      "reviewStatus": "documented",
      "variant": "Multiple proposed sapiosexual designs"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Sexual_identity"
      ],
      "evidence": "Article identifies attraction to intelligence and treats this as a descriptor rather than a sexual orientation."
    }
  },
  {
    "id": "skoliosexual",
    "label": "Skoliosexual",
    "words": [
      "skoliosexual"
    ],
    "colors": [],
    "category": "Attraction descriptor",
    "definition": "A contested label for attraction to nonbinary or transgender people.",
    "sources": [
      "https://www.healthline.com/health/different-types-of-sexuality",
      "https://es.wikipedia.org/wiki/Ceterosexualidad"
    ],
    "contextTerms": [],
    "flag": {
      "status": "unverified",
      "note": "Unresolved for the catalog definition. Article treats skoliosexual as former ceterosexual name and displays a ceterosexual flag. Equivalence is contested; do not silently rename or assign.",
      "sources": [],
      "reviewStatus": "unresolved"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://es.wikipedia.org/wiki/Ceterosexualidad"
      ],
      "evidence": "Spanish article explicitly names skoliosexualidad as the former term and documents disputed definitions involving transgender and nonbinary people. Terminological equivalence is contested; this establishes recognition, not endorsement or a universal scope."
    }
  },
  {
    "id": "unlabeled",
    "label": "Unlabeled",
    "words": [
      "unlabeled",
      "unlabelled"
    ],
    "colors": [
      "#E7F9E4",
      "#FFFFFF",
      "#DEF0F7",
      "#FAE2C3"
    ],
    "category": "Identity description",
    "definition": "Choosing not to label one’s orientation or gender.",
    "sources": [
      "https://commons.wikimedia.org/wiki/File:Unlabeled_Pride_Flag.svg",
      "https://en.wikipedia.org/wiki/Sexual_identity#Unlabeled_sexuality"
    ],
    "contextTerms": [
      "unlabeled",
      "unlabelled"
    ],
    "flag": {
      "status": "verified",
      "note": "Raw SVG inspected: green white blue orange, RGB 231/249/228,255/255/255,222/240/247,250/226/195. Asset https://upload.wikimedia.org/wikipedia/commons/6/6c/Unlabeled_Pride_Flag.svg revision 10 May 2025 21:10.",
      "sources": [
        "https://commons.wikimedia.org/wiki/File:Unlabeled_Pride_Flag.svg"
      ],
      "reviewStatus": "documented",
      "variant": "December 2020 pastel four-stripe representation",
      "source": "https://commons.wikimedia.org/wiki/File:Unlabeled_Pride_Flag.svg"
    },
    "definitionStatus": "public-reference",
    "romantic": false,
    "verification": {
      "status": "wikipedia",
      "sources": [
        "https://en.wikipedia.org/wiki/Sexual_identity#Unlabeled_sexuality"
      ],
      "evidence": "Section documents choosing not to label sexual identity. It does not directly support the extra gender scope in the catalog definition."
    }
  }
];

EXP.Catalog = (() => {
  const ambiguous = new Set(['queer', 'gay', 'mlm', 'wlw', 'demi', 'cupio', 'fray', 'lithro', 'akoi', 'androgynous', 'omni', 'abro', 'multi', 'qpr', 'butch', 'femme', 'questioning']);
  const inclusiveAllowed = new Set(['queer', 'gay', 'wlw', 'butch', 'femme', 'questioning']);
  const acronym = new Set(['mlm', 'wlw', 'qpr']);
  const positiveWords = Object.freeze(['identity', 'identities', 'identifies', 'orientation', 'sexuality', 'gender', 'pride', 'flag', 'community', 'lgbt', 'lgbtq', 'lgbtqia', 'asexual', 'aromantic', 'trans', 'nonbinary']);
  const negativeByTerm = Object.freeze({
    mlm: ['marketing', 'sales', 'scheme', 'company', 'business'], qpr: ['quarterly', 'progress review', 'report'], demi: ['lovato', 'moore', 'god'],
    fray: ['edge', 'edges', 'fabric', 'rope', 'battle'], omni: ['channel', 'hotel', 'resort', 'broadcast'], multi: ['factor', 'purpose', 'player', 'color', 'million'],
    gay: ['gale'], questioning: ['witness', 'suspect', 'police']
  });
  const normalize = (value) => String(value).normalize('NFKC').toLocaleLowerCase('en-US');
  const slug = (value) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const identities = EXP.CatalogData.map((source) => {
    const terms = source.words.map((text, index) => {
      const normalized = normalize(text);
      const requiresIdentityContext = (source.contextTerms || []).some(value => normalize(value) === normalized);
      const isAmbiguous = ambiguous.has(normalized) || requiresIdentityContext;
      return Object.freeze({
        id: `${source.id}:${slug(text) || index}`,
        text,
        normalized,
        kind: isAmbiguous ? 'shorthand' : index === 0 ? 'canonical' : /[\s/-]/.test(text) ? 'explicit-phrase' : 'alias',
        casePolicy: acronym.has(normalized) ? 'acronym-preferred' : 'insensitive',
        contextRuleId: isAmbiguous ? `context:${normalized}` : 'context:none',
        decisionFloor: isAmbiguous ? 'supported' : 'explicit',
        requiresIdentityContext,
        allowInclusive: inclusiveAllowed.has(normalized),
        negatives: Object.freeze(negativeByTerm[normalized] || [])
      });
    });
    return Object.freeze({ id: source.id, label: source.label, colors: Object.freeze([...source.colors]), terms: Object.freeze(terms), definition: source.definition || '', definitionStatus: source.definitionStatus || 'pending', recognitionNote: source.recognitionNote || '', romantic: source.romantic === true, verification: Object.freeze({status: source.verification?.status || 'unverified', sources: Object.freeze([...(source.verification?.sources || [])])}), category: source.category || 'Community term', sources: Object.freeze([...(source.sources || [])]), flag: Object.freeze({ ...source.flag, sources: Object.freeze([...(source.flag?.sources || [])]) }), defaultEnabled: true });
  });
  const byId = new Map(identities.map((item) => [item.id, item]));
  const termMap = new Map();
  for (const identity of identities) for (const term of identity.terms) {
    if (!termMap.has(term.normalized)) termMap.set(term.normalized, []);
    termMap.get(term.normalized).push(Object.freeze({ identity, term }));
  }
  const collisions = [...termMap].filter(([, records]) => new Set(records.map(({ identity }) => identity.id)).size > 1).map(([term, records]) => Object.freeze({ term, identities: Object.freeze(records.map(({ identity }) => identity.id)) }));
  const invalid = [];
  if (!identities.length || identities.some(identity => !identity.terms.length)) invalid.push('CATALOG_EMPTY');
  if (byId.size !== identities.length) invalid.push('CATALOG_DUPLICATE_ID');
  if (identities.some((identity) => !/^[a-z][a-z0-9-]+$/.test(identity.id) || (!identity.colors.length && identity.flag.status !== 'unverified') || identity.colors.some((color) => !/^#[0-9a-f]{6}$/i.test(color)) || identity.sources.some(url => !/^https:\/\//.test(url)))) invalid.push('CATALOG_SCHEMA');
  if (identities.some(identity => [...identity.flag.sources, identity.flag.source].filter(Boolean).some(url => !/^https:\/\//.test(url)) || (identity.flag.status === 'verified' && (!identity.flag.source || !identity.flag.variant)))) invalid.push('CATALOG_FLAG_REFERENCE');
  if (collisions.length) invalid.push('CATALOG_TERM_COLLISION');
  const search = (query = '') => { const needle = normalize(query.trim()); return identities.filter((identity) => !needle || normalize(identity.label).includes(needle) || normalize(identity.definition).includes(needle) || identity.terms.some((term) => term.normalized.includes(needle))); };
  const evidenceGaps = identity => ({definition:identity.definitionStatus!=='public-reference',flag:identity.flag.reviewStatus!=='documented',palette:identity.flag.status!=='verified'});
  const review = (kind='any') => identities.filter(identity=>{const gaps=evidenceGaps(identity);return kind==='any'?Object.values(gaps).some(Boolean):Boolean(gaps[kind]);});
  const status = () => Object.freeze({ valid: invalid.length === 0, errors: Object.freeze([...invalid]), identities: identities.length, terms: [...termMap.values()].reduce((n, items) => n + items.length, 0), collisions: collisions.length });
  return Object.freeze({ identities: Object.freeze(identities), evidenceGaps, review, termMap, collisions: Object.freeze(collisions), positiveWords, normalize, has: (id) => byId.has(id), get: (id) => byId.get(id), search, status });
})();

EXP.Settings = (() => {
  const PREFIX = 'exp:v3:prisma';
  const SCHEMA = 1;
  const memory = new Map();
  const defaults = Object.freeze({
    schema: SCHEMA,
    enabled: true,
    style: 'gradient',
    intensity: 'balanced',
    animation: false,
    animationStyle: 'pulse',
    labels: false,
    matcherMode: 'balanced',
    ambiguityProtection: true,
    surroundingContext: true,
    includeRomantic: false,
    disabledIdentities: [],
    reducedMotion: 'system',
    highContrast: false,
    nonColorIndicator: 'underline',
    screenReaderBehavior: 'original-text',
    safeMode: false,
    shortcut: '',
    launcherPosition: 'automatic-end-bottom',
    menuWidth: 'compact',
    uiTheme: 'prisma',
    menuAutoClose: true,
    menuNotifications: true,
    updateNotifications: false,
    siteOverrides: {},
    ignoredPhrases: [],
    exclusions: []
  });
  let state;
  const listeners = new Set();
  const key = (name) => `${PREFIX}:${name}`;
  function rawRead(name) {
    const storageKey = key(name);
    try {
      if (typeof GM_getValue === 'function') {
        const value = GM_getValue(storageKey, undefined);
        if (value !== undefined) return value;
      }
    } catch {}
    try {
      const value = localStorage.getItem(storageKey);
      if (value !== null) {
        const parsed = JSON.parse(value);
        memory.set(storageKey, parsed);
        try { if (typeof GM_setValue === 'function') GM_setValue(storageKey, parsed); } catch {}
        return parsed;
      }
    } catch {}
    return memory.get(storageKey);
  }
  function rawWrite(name, value) {
    const storageKey = key(name);
    memory.set(storageKey, value);
    try { if (typeof GM_setValue === 'function') GM_setValue(storageKey, value); } catch {}
    try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch {}
  }
  const isHost = (value) => typeof value === 'string' && value.length > 0 && value.length <= 253 && !/[/?#\s]/.test(value);
  const uniqueStrings = (value, maximum = 500) => Array.isArray(value) ? [...new Set(value.filter((item) => typeof item === 'string'))].slice(0, maximum) : [];
  function validate(candidate) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) throw Object.assign(new Error('Settings must be an object'), { code: 'SETTINGS_TYPE' });
    const next = ExtraPotionsCore.cloneSettings(defaults);
	const themeAliases = { warm: 'ember', discord: 'glacier', pine: 'verdant', obsidian: 'contrast' };
	const normalizedUiTheme = themeAliases[candidate.uiTheme] || candidate.uiTheme;
    for (const name of ['enabled', 'animation', 'labels', 'ambiguityProtection', 'surroundingContext', 'includeRomantic', 'highContrast', 'safeMode', 'updateNotifications', 'menuAutoClose', 'menuNotifications']) if (typeof candidate[name] === 'boolean') next[name] = candidate[name];
    const enums = {
      animationStyle: ['pulse', 'shimmer', 'glow'],
      style: ['gradient', 'underline', 'soft-fill'], intensity: ['subtle', 'balanced', 'vivid'], matcherMode: ['strict', 'balanced', 'inclusive'],
      reducedMotion: ['system', 'reduce', 'allow'], nonColorIndicator: ['underline', 'outline', 'off'],
      screenReaderBehavior: ['original-text', 'announce-on-focus'], launcherPosition: ['automatic-end-bottom', 'end-top', 'end-bottom', 'start-top', 'start-bottom'], menuWidth: ['full', 'compact', 'narrow'], uiTheme: ['ember', 'midnight', 'glacier', 'contrast', 'verdant', 'pride', 'crimson', 'prisma']
    };
    for (const [name, values] of Object.entries(enums)) {
	  const value = name === 'uiTheme' ? normalizedUiTheme : candidate[name];
	  if (values.includes(value)) next[name] = value;
	}
    next.disabledIdentities = uniqueStrings(candidate.disabledIdentities).filter((id) => EXP.Catalog?.has(id) ?? /^[a-z][a-z0-9-]+$/.test(id));
    next.ignoredPhrases=uniqueStrings(candidate.ignoredPhrases,200).filter(v=>v.trim()&&v.length<=200).map(v=>v.trim());
    next.exclusions = uniqueStrings(candidate.exclusions).filter(isHost);
    if (typeof candidate.shortcut === 'string' && candidate.shortcut.length <= 40) next.shortcut = candidate.shortcut;
    if (candidate.siteOverrides && typeof candidate.siteOverrides === 'object' && !Array.isArray(candidate.siteOverrides)) {
      for (const [host, value] of Object.entries(candidate.siteOverrides)) {
        if (!isHost(host) || !value || typeof value !== 'object' || Array.isArray(value)) continue;
        const site = {};
        site.ignoredPhrases=uniqueStrings(value.ignoredPhrases,200).filter(v=>v.trim()&&v.length<=200).map(v=>v.trim());
        if (['strict', 'balanced', 'inclusive'].includes(value.matcherMode)) site.matcherMode = value.matcherMode;
        if (typeof value.ambiguityProtection === 'boolean') site.ambiguityProtection = value.ambiguityProtection;
        if (typeof value.surroundingContext === 'boolean') site.surroundingContext = value.surroundingContext;
        if (value.identityOverrides && typeof value.identityOverrides === 'object' && !Array.isArray(value.identityOverrides)) {
          site.identityOverrides = Object.fromEntries(Object.entries(value.identityOverrides).filter(([id, mode]) => (EXP.Catalog?.has(id) ?? true) && ['on', 'off'].includes(mode)));
        }
        next.siteOverrides[host] = site;
      }
    }
    return next;
  }
  function load() {
    const stored = rawRead('settings');
    state = validate(stored || defaults);
    rawWrite('settings', state);
    return snapshot();
  }
  function snapshot() { return ExtraPotionsCore.cloneSettings(state || defaults); }
  function replace(value, reason = 'replace') { const next = validate(value);  rawWrite('settings', next); state = next; for (const listener of listeners) listener(snapshot(), reason); return snapshot(); }
  function update(patch, reason = 'update') { return replace({ ...snapshot(), ...patch }, reason); }
  function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
  function effective(host = location.hostname) {
    const current = snapshot();
    const site = current.siteOverrides[host] || {};
    const disabled = new Set(current.disabledIdentities);
    for (const [id, mode] of Object.entries(site.identityOverrides || {})) { if (mode === 'off') disabled.add(id); else disabled.delete(id); }
    return { ...current, ...site, ignoredPhrases:[...current.ignoredPhrases,...(site.ignoredPhrases||[])], disabledIdentities: [...disabled], excluded: current.exclusions.includes(host) };
  }
  function exportData() { return { product: 'prisma', generation: 3, schema: SCHEMA, settings: snapshot() }; }
  function prepareImport(payload) {
    if (!payload || payload.product !== 'prisma' || payload.generation !== 3 || payload.schema !== SCHEMA) throw Object.assign(new Error('This is not a supported PRISMA V3 export'), { code: 'IMPORT_SCHEMA' });
    return validate(payload.settings);
  }
  return Object.freeze({PREFIX, SCHEMA, defaults, validate, load, snapshot, replace, update, subscribe, effective, exportData, prepareImport, hasStored: () => rawRead('settings') !== undefined });
})();

EXP.Matcher = (() => {
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordLike = /[\p{L}\p{N}\p{M}_]/u;
  let cacheKey = '';
  let expression = null;
  let lookup = new Map();
  const counts = () => ({ 'eligible-explicit': 0, 'eligible-supported': 0, 'review-ambiguous': 0, 'blocked-negative': 0 });
  function compile(settings) {
    const disabled = new Set(settings.disabledIdentities || []);
    const key = [...disabled].sort().join('|');
    if (key === cacheKey && expression) return;
    cacheKey = key;
    lookup = new Map();
    for (const [term, records] of EXP.Catalog.termMap) {
      const enabled = records.filter(({ identity }) => !disabled.has(identity.id));
      if (enabled.length) lookup.set(term, enabled);
    }
    const alternatives = [...lookup.keys()].sort((left, right) => right.length - left.length).map(escape);
    expression = alternatives.length ? new RegExp(alternatives.join('|'), 'giu') : null;
  }
  function boundary(text, start, end) {
    const before = start > 0 ? text[start - 1] : '';
    const after = end < text.length ? text[end] : '';
    return (!before || !wordLike.test(before)) && (!after || !wordLike.test(after));
  }
  function evaluate(record, sourceText, start, end, settings) {
    const { term } = record;
    if (term.decisionFloor === 'explicit') return { band: 'eligible-explicit', rules: ['TERM_EXPLICIT'] };
    const windowStart = Math.max(0, start - 96);
    const windowEnd = Math.min(sourceText.length, end + 96);
    const context = EXP.Catalog.normalize(`${sourceText.slice(windowStart, start)} ${sourceText.slice(end, windowEnd)}`);
    const hasPositive = settings.surroundingContext && (term.requiresIdentityContext
      ? /\b(?:gender|orientation|sexuality|pride|lgbtq?(?:ia)?|identity label)\b/u.test(context)
      : EXP.Catalog.positiveWords.some((word) => new RegExp(`\\b${escape(word)}\\b`, 'u').test(context)));
    const hasNegative = settings.ambiguityProtection && term.negatives.some((word) => context.includes(word));
    if (hasNegative) return { band: 'blocked-negative', rules: [term.contextRuleId, 'NEGATIVE_CONTEXT'] };
    if (hasPositive) return { band: 'eligible-supported', rules: [term.contextRuleId, 'POSITIVE_CONTEXT'] };
    if (settings.matcherMode === 'inclusive' && term.allowInclusive) return { band: 'eligible-supported', rules: [term.contextRuleId, 'INCLUSIVE_OPT_IN'] };
    return { band: 'review-ambiguous', rules: [term.contextRuleId, settings.surroundingContext ? 'SUPPORT_MISSING' : 'CONTEXT_DISABLED'] };
  }
  function find(text, settings) {
    compile(settings);
    const decisions = counts();
    if (!expression || !text) return { eligible: [], decisions };
    const ignored=(settings.ignoredPhrases||[]).map(EXP.Catalog.normalize);
    const normalizedText=EXP.Catalog.normalize(text);
    if(ignored.some(phrase=>normalizedText.includes(phrase))){decisions['blocked-negative']+=1;return {eligible:[],decisions};}
    expression.lastIndex = 0;
    const eligible = [];
    for (const match of text.matchAll(expression)) {
      const start = match.index;
      const end = start + match[0].length;
      if (!boundary(text, start, end)) continue;
      const records = lookup.get(EXP.Catalog.normalize(match[0])) || [];
      if (records.length !== 1) { decisions['blocked-negative'] += 1; continue; }
      if (records[0].identity.romantic && settings.includeRomantic !== true) continue;
      const result = evaluate(records[0], text, start, end, settings);
      decisions[result.band] += 1;
      const allowed = result.band === 'eligible-explicit' || result.band === 'eligible-supported';
      if (allowed && (settings.matcherMode !== 'strict' || result.band === 'eligible-explicit')) eligible.push(Object.freeze({ ...records[0], start, end, source: match[0], decisionBand: result.band, ruleIds: Object.freeze(result.rules) }));
    }
    return { eligible, decisions };
  }
  return Object.freeze({ find, reset: () => { cacheKey = ''; expression = null; lookup = new Map(); } });
})();

EXP.Renderer = (() => {
  const HIT = 'exp-prisma-hit';
  const styles = new Map();
  const wrappers = new Set();
  let hidden = false;
  let currentSettings;
  const css = `
.${HIT}{--prisma-colors:#ff4f9a,#55d6ff;box-sizing:border-box!important;border-radius:3px!important;position:relative!important;background:none!important;color:inherit!important;-webkit-text-fill-color:currentColor!important;text-decoration:none!important;text-decoration-skip-ink:auto!important}
.${HIT}[data-style="gradient"]{background-image:linear-gradient(90deg,var(--prisma-colors))!important;background-clip:text!important;-webkit-background-clip:text!important;color:transparent!important;-webkit-text-fill-color:transparent!important}
.${HIT}[data-style="underline"]{background-image:linear-gradient(var(--prisma-primary),var(--prisma-primary))!important;background-repeat:no-repeat!important;background-position:0 100%!important;background-size:100% var(--prisma-weight)!important;color:inherit!important;-webkit-text-fill-color:currentColor!important;text-decoration-line:underline!important;text-decoration-color:var(--prisma-primary)!important;text-decoration-thickness:var(--prisma-weight)!important;text-underline-offset:.12em!important}
.${HIT}[data-style="soft-fill"]{background-color:var(--prisma-soft-fill)!important;background-image:none!important;color:inherit!important;-webkit-text-fill-color:currentColor!important;padding-inline:.08em!important;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.${HIT}[data-indicator="underline"]{box-shadow:inset 0 -1px 0 var(--prisma-primary)!important}
.${HIT}[data-indicator="outline"]{outline:1px dashed currentColor!important;outline-offset:1px!important}
.${HIT}[data-hidden="1"]{background:none!important;box-shadow:none!important;outline:0!important;color:inherit!important;-webkit-text-fill-color:currentColor!important;text-decoration:none!important}
.${HIT}[data-contrast="1"]{outline:2px solid currentColor;outline-offset:1px;background:Canvas!important;color:CanvasText!important;-webkit-text-fill-color:CanvasText!important}
.${HIT}[data-animate="1"]:not([data-hidden="1"]):not([data-contrast="1"]){animation:exp-prisma-pulse 5s ease-in-out infinite}
.${HIT}[data-animate="1"][data-animation="shimmer"]:not([data-hidden="1"]):not([data-contrast="1"]){animation-name:exp-prisma-shimmer}
.${HIT}[data-animate="1"][data-animation="glow"]:not([data-hidden="1"]):not([data-contrast="1"]){animation-name:exp-prisma-glow}
@keyframes exp-prisma-pulse{0%,100%{opacity:1}50%{opacity:.65}}
@keyframes exp-prisma-shimmer{0%,100%{filter:brightness(1)}50%{filter:brightness(1.45)}}
@keyframes exp-prisma-glow{0%,100%{text-shadow:0 0 0 transparent}50%{text-shadow:0 0 5px var(--prisma-primary)}}
@media(prefers-reduced-motion:reduce){.${HIT}[data-motion="system"]{animation:none!important}}
@media(forced-colors:active){.${HIT}[data-style]{background:none!important;color:CanvasText!important;-webkit-text-fill-color:CanvasText!important;outline:1px solid Highlight;text-decoration:underline;animation:none!important}}
`;
  function ensureStyle(root = document) {
    if (styles.has(root)) return;
    const style = EXP.Core.injectStyle(root, css, { expPrismaStyle: '1' });
    styles.set(root, style);
  }
  function clearInlineVisual(span) {
    for (const property of [
      'background-color', 'background-image', 'background-position', 'background-repeat', 'background-size',
      'box-decoration-break', '-webkit-box-decoration-break', 'padding-inline', 'background-clip', '-webkit-background-clip', 'color', '-webkit-text-fill-color',
      'text-decoration-color', 'text-decoration-line', 'text-decoration-thickness', 'text-underline-offset'
    ]) span.style.removeProperty(property);
  }
  function applyInlineVisual(span, style, primary, weight, softFill) {
    clearInlineVisual(span);
    if (style === 'gradient') {
      ExtraPotionsCore.applyTextGradient(span, 'linear-gradient(90deg,var(--prisma-colors))');
    }
    if (style === 'underline' || style === 'soft-fill') {
      span.style.setProperty('background-clip', 'border-box', 'important');
      span.style.setProperty('-webkit-background-clip', 'border-box', 'important');
      span.style.setProperty('color', 'inherit', 'important');
      span.style.setProperty('-webkit-text-fill-color', 'currentColor', 'important');
    }
    if (style === 'underline') {
      span.style.setProperty('background-color', 'transparent', 'important');
      span.style.setProperty('background-image', `linear-gradient(${primary},${primary})`, 'important');
      span.style.setProperty('background-repeat', 'no-repeat', 'important');
      span.style.setProperty('background-position', '0 100%', 'important');
      span.style.setProperty('background-size', `100% ${weight}`, 'important');
      span.style.setProperty('text-decoration-line', 'underline', 'important');
      span.style.setProperty('text-decoration-color', primary, 'important');
      span.style.setProperty('text-decoration-thickness', weight, 'important');
      span.style.setProperty('text-underline-offset', '.12em', 'important');
    } else if (style === 'soft-fill') {
      span.style.setProperty('background-color', softFill, 'important');
      span.style.setProperty('background-image', 'none', 'important');
      span.style.setProperty('padding-inline', '.08em', 'important');
      span.style.setProperty('-webkit-box-decoration-break', 'clone', 'important');
      span.style.setProperty('box-decoration-break', 'clone', 'important');
    }
  }
  function applyVisual(span, record, settings) {
    currentSettings = settings;
    const hasPalette = record.identity.colors.length > 0;
    const colors = hasPalette ? record.identity.colors : ['currentColor'];
    const visualStyle = hasPalette ? settings.style : 'underline';
    const levels = { subtle: ['2px', '14%'], balanced: ['3px', '22%'], vivid: ['4px', '32%'] };
    span.dataset.style = visualStyle;
    span.dataset.palette = hasPalette ? record.identity.flag?.status || 'legacy' : 'neutral';
    span.dataset.indicator = settings.nonColorIndicator;
    span.dataset.contrast = settings.highContrast ? '1' : '0';
    span.dataset.animate = settings.animation && settings.reducedMotion !== 'reduce' ? '1' : '0';
    span.dataset.animation = settings.animationStyle || 'pulse';
    span.dataset.motion = settings.reducedMotion;
    span.dataset.hidden = hidden ? '1' : '0';
    span.style.setProperty('--prisma-colors', colors.join(','));
    span.style.setProperty('--prisma-primary', colors[0]);
    span.style.setProperty('--prisma-weight', levels[settings.intensity][0]);
    span.style.setProperty('--prisma-fill', levels[settings.intensity][1]);
    const hex = /^#([0-9a-f]{6})$/i.exec(colors[0]);
    const alpha = ({ subtle: .14, balanced: .22, vivid: .32 })[settings.intensity] || .22;
    const softFill = hex ? `rgba(${parseInt(hex[1].slice(0,2),16)},${parseInt(hex[1].slice(2,4),16)},${parseInt(hex[1].slice(4,6),16)},${alpha})` : colors[0];
    span.style.setProperty('--prisma-soft-fill', softFill);
    applyInlineVisual(span, hidden || settings.highContrast ? 'off' : visualStyle, colors[0], levels[settings.intensity][0], softFill);
    span.title = settings.labels ? [record.identity.label, record.identity.definition].filter(Boolean).join(': ') : '';
    if (settings.screenReaderBehavior === 'announce-on-focus') {
      span.tabIndex = -1;
      span.setAttribute('aria-label', `${span.textContent}, ${record.identity.label} identity-language match`);
    } else {
      span.removeAttribute('tabindex');
      span.removeAttribute('aria-label');
    }
  }
  function wrap(node, candidates, settings, createRecord) {
    if (!node.parentNode || !candidates.length) return [];
    ensureStyle(node.getRootNode());
    const fragment = document.createDocumentFragment();
    const text = node.nodeValue;
    const records = [];
    let cursor = 0;
    for (const candidate of candidates) {
      if (candidate.start < cursor) continue;
      fragment.append(document.createTextNode(text.slice(cursor, candidate.start)));
      const span = document.createElement('span');
      span.className = HIT;
      span.dataset.expOwned = '1';
      span.dataset.identity = candidate.identity.id;
      span.textContent = text.slice(candidate.start, candidate.end);
      applyVisual(span, candidate, settings);
      const record = createRecord(candidate, span);
      span.dataset.matchId = record.matchId;
      wrappers.add(span);
      records.push(record);
      fragment.append(span);
      cursor = candidate.end;
    }
    fragment.append(document.createTextNode(text.slice(cursor)));
    node.replaceWith(fragment);
    return records;
  }
  function clear() {
    const parents = new Set();
    for (const span of [...wrappers]) {
      if (span.isConnected && span.matches(`.${HIT}`)) { const parent = span.parentNode; span.replaceWith(document.createTextNode(span.textContent || '')); if (parent) parents.add(parent); }
      wrappers.delete(span);
    }
    for (const parent of parents) parent.normalize?.();
  }
  function refresh(settings) { for (const span of [...wrappers]) { if (!span.isConnected) { wrappers.delete(span); continue; } const identity = EXP.Catalog.get(span.dataset.identity); if (identity) applyVisual(span, { identity }, settings); } }
  function setHidden(value) { hidden = Boolean(value); if (currentSettings) refresh(currentSettings); }
  function focus(record) { if (!record?.element?.isConnected) return false; record.element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' }); record.element.focus({ preventScroll: true }); record.element.dataset.current = '1'; setTimeout(() => { if (record.element) delete record.element.dataset.current; }, 1200); return true; }
  function cleanup() { clear(); for (const style of styles.values()) style.remove(); styles.clear(); hidden = false; }
  return Object.freeze({ HIT, ensureStyle, wrap, clear, refresh, setHidden, focus, cleanup, wrapperCount: () => [...wrappers].filter((node) => node.isConnected).length });
})();

EXP.Engine = (() => {
  const matches = new Map();
  const listeners = new Set();
  const metrics = { scans: 0, batches: 0, nodes: 0, candidates: 0, rendered: 0, detached: 0, lastDurationMs: 0 };
  const decisions = { 'eligible-explicit': 0, 'eligible-supported': 0, 'review-ambiguous': 0, 'blocked-negative': 0 };
  let routeEpoch = 1;
  let sequence = 0;
  let currentIndex = -1;
  let temporarilyHidden = false;
  let settings = null;
  let active = false;
  let currentHref = location.href;
  const ignoredSelector = ['script', 'style', 'noscript', 'template', 'textarea', 'input', 'select', 'option', 'button', 'pre', 'code', '[contenteditable]', '[inert]', '[hidden]', '[aria-hidden="true"]', '[data-exp-owned="1"]'].join(',');
  const notify = () => {
    const value = snapshot();
    globalThis.ExtraPotionsCore?.publishSuiteState?.('prisma', 'prisma.state-changed', {
      status: value.status,
      total: value.total,
      temporarilyHidden: Boolean(value.temporarilyHidden),
    });
    for (const listener of listeners) listener(value);
  };
  const isIgnored = (node) => Boolean(
    node?.parentElement?.closest(ignoredSelector) ||
    globalThis.ExtraPotionsCore?.isPresentationSuppressed?.(node?.parentElement)
  );
  function resetDecisionCounts() { for (const key of Object.keys(decisions)) decisions[key] = 0; }
  function addDecisions(value) { for (const [key, count] of Object.entries(value)) decisions[key] += count; }
  function createRecord(candidate, element) {
    const record = Object.freeze({
      matchId: `r${routeEpoch}-m${++sequence}`,
      identityId: candidate.identity.id,
      termId: candidate.term.id,
      decisionBand: candidate.decisionBand,
      ruleIds: candidate.ruleIds,
      routeEpoch,
      element
    });
    matches.set(record.matchId, record);
    return record;
  }
  function processText(node) {
    if (!node?.isConnected || !node.nodeValue?.trim() || isIgnored(node)) return;
    metrics.nodes += 1;
    const result = EXP.Matcher.find(node.nodeValue, settings);
    addDecisions(result.decisions);
    metrics.candidates += Object.values(result.decisions).reduce((sum, value) => sum + value, 0);
    if (result.eligible.length) {
      const records = EXP.Renderer.wrap(node, result.eligible, settings, createRecord);
      metrics.rendered += records.length;
    }
  }
  function collectRoots(root) {
    const roots = [root];
    const base = root?.querySelectorAll ? root : null;
    if (base) for (const element of base.querySelectorAll('*')) if (element.shadowRoot) roots.push(element.shadowRoot);
    return roots;
  }
  function scanRoot(root) {
    if (!root?.isConnected && !(root instanceof ShadowRoot)) return;
    for (const scan of collectRoots(root)) {
      EXP.Renderer.ensureStyle(scan.getRootNode ? scan.getRootNode() : document);
      if (scan.nodeType === Node.TEXT_NODE) processText(scan);
      else {
        const walker = document.createTreeWalker(scan, NodeFilter.SHOW_TEXT, { acceptNode: (node) => isIgnored(node) || !node.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
        const nodes = [];
        let node;
        while ((node = walker.nextNode())) nodes.push(node);
        for (const text of nodes) processText(text);
      }
    }
  }
  function prune() {
    for (const [id, record] of matches) if (!record.element.isConnected) { matches.delete(id); metrics.detached += 1; }
    if (currentIndex >= matches.size) currentIndex = matches.size - 1;
  }
  function canRun(value = settings) { return active && value?.enabled && !value.safeMode && !value.excluded && EXP.Catalog.status().valid; }
  function processBatch(roots) {
    if (location.href !== currentHref) { currentHref = location.href; navigation(); return; }
    const started = performance.now();
    metrics.batches += 1;
    prune();
    if (!canRun()) { notify(); return; }
    for (const root of roots) scanRoot(root);
    metrics.lastDurationMs = Math.round((performance.now() - started) * 10) / 10;
    notify();
  }
  function rebuild(reason = 'rebuild') {
    const started = performance.now();
    EXP.Renderer.clear();
    matches.clear();
    currentIndex = -1;
    sequence = 0;
    resetDecisionCounts();
    metrics.nodes = 0; metrics.candidates = 0; metrics.rendered = 0;
    EXP.Matcher.reset();
    settings = EXP.Settings.effective();
    EXP.Renderer.setHidden(temporarilyHidden);
    if (canRun() && document.body) scanRoot(document.body);
    metrics.scans += 1;
    metrics.lastDurationMs = Math.round((performance.now() - started) * 10) / 10;
    notify();
    return reason;
  }
  function navigation() { currentHref = location.href; routeEpoch += 1; temporarilyHidden = false; rebuild('navigation'); }
  function ordered() { prune(); return [...matches.values()].sort((left, right) => { if (left.element === right.element) return 0; return left.element.compareDocumentPosition(right.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; }); }
  function navigate(delta) {
    const list = ordered();
    if (!list.length) return null;
    currentIndex = (currentIndex + delta + list.length) % list.length;
    const record = list[currentIndex];
    EXP.Renderer.focus(record);
    notify();
    return { record, position: currentIndex + 1, total: list.length };
  }
  function navigateTo(matchId) {
    const list = ordered();
    const index = list.findIndex((record) => record.matchId === matchId);
    if (index < 0) return null;
    currentIndex = index;
    EXP.Renderer.focus(list[index]);
    notify();
    return { record: list[index], position: index + 1, total: list.length };
  }
  function summary() { const totals = {}; for (const record of matches.values()) totals[record.identityId] = (totals[record.identityId] || 0) + 1; return totals; }
  function snapshot(options = {}) {
    prune();
    const state = settings || EXP.Settings.effective();
    return Object.freeze({
      status: !EXP.Catalog.status().valid ? 'catalog-invalid' : state.safeMode ? 'safe-mode' : state.excluded ? 'excluded' : !state.enabled ? 'disabled' : active ? 'ready' : 'stopped',
      routeEpoch, total: matches.size, summary: summary(), decisions: { ...decisions }, metrics: { ...metrics }, currentIndex,
      temporarilyHidden, matches: ordered().map((record) => ({ matchId: record.matchId, identityId: record.identityId, ...(options.includeMatchText ? { text: record.element.textContent || '' } : {}) }))
    });
  }
  function setTemporaryHidden(value) { temporarilyHidden = Boolean(value); EXP.Renderer.setHidden(temporarilyHidden); notify(); }
  function start() { active = true; settings = EXP.Settings.effective(); rebuild('start'); }
  function stop() { active = false; EXP.Renderer.clear(); matches.clear(); notify(); }
  function cleanup() { stop(); EXP.Renderer.cleanup(); listeners.clear(); }
  return Object.freeze({ start, stop, cleanup, rebuild, navigation, processBatch, snapshot, navigateNext: () => navigate(1), navigatePrevious: () => navigate(-1), navigateTo, setTemporaryHidden, highlightAll: () => setTemporaryHidden(false), subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); } });
})();

EXP.VERSION = '3.1.12';

EXP.ReleaseNotes = (() => {
  const notes = Object.freeze({
    '3.1.12': ['Updates the shared foundation to exp-core 3.4.0.','Rebuilds shared UI, launcher, diagnostics, notices, and coordination from the pinned Core release.','Leaves PRISMA product-specific engine behavior unchanged.'],
    '3.1.11': ['Updates the shared foundation to exp-core 3.3.17.','Rebuilds shared UI, launcher, diagnostics, notices, and coordination from the pinned Core release.','Leaves PRISMA product-specific engine behavior unchanged.'],
    '3.1.10': ['Updates the shared foundation to exp-core 3.3.15.','Rebuilds shared UI, launcher, diagnostics, notices, and coordination from the pinned Core release.','Leaves PRISMA product-specific engine behavior unchanged.'],
    '3.1.9': ['Updates the shared foundation to exp-core 3.3.13.','Rebuilds shared UI, launcher, diagnostics, notices, and coordination from the pinned Core release.','Leaves PRISMA product-specific engine behavior unchanged.'],
    '3.1.8': ["Adds the shared themed outer menu border across the ExtraPotions suite.","Bundles exp-core 3.3.12 pinned to the verified Dropper 3.3.15 baseline.","Preserves PRISMA identity recognition, catalog data, and flag rendering behavior."],
    '3.1.7': ['Lets every launcher move left, right, up, or down within the shared grid.','Persists launcher order and supports Alt+Arrow keyboard reordering.','Bundles exp-core 3.3.11 without changing identity recognition or flag data.'],
    '3.1.6': ['Adds layered menu surfaces so cards, controls, and inputs remain visually distinct.','Uses accessible semantic colors for links, focus indicators, and accent text.','Bundles the verified exp-core 3.3.10 artifact without changing identity recognition or flag data.'],
    '3.1.5': ["Compacts System menus and keeps menu width controls together on one row.","Groups existing menu preferences consistently while preserving saved settings.","Removes automatic Settings Backup and its restore controls.","Adds a Bitcoin donation option with address copying and wallet support."],
    '3.1.4': ["Bundles exp-core 3.3.8 with section arrangement and viewport-safe menus.","Preserves the current identity catalog, romantic options, and phrase corrections.","Refreshes the README and feature screenshots in a horizontal gallery."],
    '3.1.3': ["Adds site-specific phrase corrections that leave matching text nodes unchanged.","Separates definition, flag-design, and exact-palette evidence review filters.","Documents 113 flag designs while keeping two definition references and 22 flag references unresolved.","Adds settings backups, rollback, and compatibility details through exp-core 3.3.7."],
    '3.1.2': ["Restores the donation button through the shared core default.","Bundles exp-core 3.3.6 so opening one launcher menu closes other product menus."],
    '3.1.1': ["Restores Firefox startup on pages with restrictive security policies using content injection.","Keeps settings copies in the userscript realm and bundles exp-core 3.3.5 with idle menu fixes."],
    '3.1.0': Object.freeze([
      'Adds Pulse, Shimmer, and Glow animation styles with saved preferences and reduced-motion support.',
      'Keeps gradient-highlighted text visible when page dark-mode styles override element backgrounds, including Wikipedia portals.',
      'Adds Wikipedia-listed check icons while keeping other definitions unverified without qualifying evidence.',
      'Adds an optional Romantic identities switch; romantic and aroace definitions remain available in the database.',
      'Adds an individual public definition and flag review for every catalog entry.',
      'Documents 133 definitions and 112 flag designs; keeps unresolved evidence visible.',
      'Verifies 30 palettes and separates definition sources from flag sources in Details.'
    ]),
    '3.0.32': Object.freeze([
      'Uses the same menu-width notice surface for Current Version, Update Available, and Update Complete, matching Dropper.',
      'Forces a fresh update check for each newly installed PRISMA version instead of inheriting the previous version\'s 15-minute throttle or stale remote version.',
      'Reports separate progress-card, launcher, launcher-row, menu, and notice geometry, and limits resource-error details to ownership plus asset hostname.'
    ]),
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

EXP.UI = (() => {
  const ICON_URL = 'https://raw.githubusercontent.com/ExtraPotions/PRISMA/main/assets/prisma-launcher.svg';
  const routeNames = Object.freeze([['page', 'Highlights'], ['appearance', 'Appearance'], ['advanced', 'Advanced'], ['system', 'System']]);
  let host, shadow, launcher, panel, live, toast, product, noticeController, toastTimer, updateCard, engineState, importDraft = null, unsubscribe;
  const PRODUCT_THEME = {"id":"prisma","name":"PRISMA gem","swatch":"linear-gradient(135deg,#100814 0 38%,#a843b6 38% 69%,#2e98a5 69% 100%)","canvas":"#100814","surface":"#211029","primary":"#a843b6","companion":"#6853c9","counterpoint":"#2e98a5","interactive":"#c05bca","bg":"#100814","panel":"#211029","line":"#4a2e55","text":"#eadcf0","muted":"#ad96b5","accent":"#a843b6","accent2":"#c05bca","skin":"linear-gradient(135deg,#a843b6 0%,#6853c9 52%,#2e98a5 100%)","skinVertical":"linear-gradient(180deg,#a843b6 0%,#6853c9 52%,#2e98a5 100%)"};
  const UI_THEMES = ExtraPotionsCore.themes(PRODUCT_THEME);
  const el = (tag, attrs = {}, text) => { const node = document.createElement(tag); for (const [name, value] of Object.entries(attrs)) { if (name === 'class') node.className = value; else node.setAttribute(name, value); } if (text !== undefined) node.textContent = text; return node; };
  function showNotice(node, {kicker,title,version=EXP.VERSION,text='',details=[],available=false}) {
    noticeController?.show({kicker,title,version,text,details,showAction:available,kind:available?'available':kicker==='Update Complete'?'complete':'current'});
  }
  function hideUpdateCard() { noticeController?.hide(); }
  function showUpdateCard(result={},complete=false,previous=''){const version=complete?EXP.VERSION:result.latest;if(!complete&&!EXP.Core.claimNotice('prisma',`available:${version}`))return;const fallback=['A newer PRISMA build is available.','Install the latest userscript for the newest fixes and improvements.'];const details=complete?EXP.ReleaseNotes.current():(Array.isArray(result.details)&&result.details.length?result.details:fallback);showNotice(updateCard,{kicker:complete?'Update Complete':'Update Available',title:complete?'PRISMA Updated':'New PRISMA Version Available',version,text:complete?`Updated from v${previous} to v${EXP.VERSION}.`:`v${result.latest} is ready to install.`,details,available:!complete},true);}
  const button = (label, action, className = 'action') => { const node = el('button', { type: 'button', class: className }, label); node.addEventListener('click', action); return node; };
  const announce = (message, kind = 'status') => { if (live) { live.textContent = message; live.dataset.kind = kind; } if (!toast || !EXP.Settings.snapshot().menuNotifications) return; toast.textContent=message;toast.hidden=false;toast.style.top=`${Math.max(8,(launcher?.getBoundingClientRect().top||60)-48)}px`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{if(toast)toast.hidden=true;},3000); };
  function group(title) { const node = el('section', { class: 'group' }); if (title) node.append(el('h3', {}, title)); return node; }
  function row(label, help = '') { const node = el('div', { class: 'row' }); const copy = el('div', { class: 'copy' }); copy.append(el('span', { class: 'label' }, label)); node.append(copy); return node; }
  function switchControl(label, help, value, change, disabled = false) { const node = row(label, help); const control = el('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(Boolean(value)), 'aria-label': label }); control.disabled = disabled; control.append(el('span', { 'aria-hidden': 'true' })); control.addEventListener('click', () => { const next = control.getAttribute('aria-checked') !== 'true'; control.setAttribute('aria-checked', String(next)); change(next); }); node.append(control); return node; }
  function selectControl(label, help, value, choices, change, disabled = false) { const node = row(label, help); const select = el('select', { 'aria-label': label }); select.disabled = disabled; for (const [id, name] of choices) { const option = el('option', { value: id }, name); option.selected = id === value; select.append(option); } select.addEventListener('change', () => change(select.value)); node.append(select); return node; }
  function actionRow(label, help, action, actionLabel = label, disabled = false) { const node = row(label, help); const control = button(actionLabel, action); if (['Reset','Reset site','Restore'].includes(actionLabel)) control.classList.add('warn'); control.disabled = disabled; node.append(control); return node; }
  function statusRow(label, help, value = '') { const node = row(label, help); if (value) node.append(el('output', { class: 'status-value' }, value)); return node; }
  const PRIDE_RAINBOW = 'linear-gradient(90deg,#c97b83,#d29a70,#d0c07d,#70a886,#7091b6,#a27ba9)';
  function applyUiTheme(id) { ExtraPotionsCore.applyTheme(host, id, UI_THEMES); }
  function themeSwatches(value, change) { const wrap=el('div',{class:'theme-row'});wrap.append(el('span',{class:'label'},'Menu theme'));const dots=el('div');const core=ExtraPotionsCore;const mount=core?.createThemeSwatches||((options)=>{dots.className='exp-theme-swatches';dots.setAttribute('role','radiogroup');for(const theme of options.themes){const dot=el('button',{type:'button',class:`exp-theme-swatch${theme.id===options.value?' is-on':''}`,'aria-label':theme.name,'aria-pressed':String(theme.id===options.value),title:theme.name});dot.style.background=theme.swatch;dot.addEventListener('click',()=>options.onChange(theme.id));dots.append(dot);}return{setValue(){},destroy(){}};});mount({container:dots,themes:UI_THEMES,value,onChange:change});wrap.append(dots);return wrap; }
  function update(patch, reason) { const next = EXP.Settings.update(patch, reason); render(); return next; }
  function download(name, text) { const url = URL.createObjectURL(new Blob([text], { type: 'application/json' })); const link = el('a', { href: url, download: name }); link.click(); setTimeout(() => URL.revokeObjectURL(url), 0); }

  function renderHighlightStyle() {
    const state = EXP.Settings.snapshot(); const section = group('Highlight style', 'Visual controls change the renderer without widening the matcher.');
    section.append(selectControl('Style', 'Uses the same eligible match set.', state.style, [['gradient', 'Gradient'], ['underline', 'Underline'], ['soft-fill', 'Soft Fill']], (style) => update({ style }, 'style')));
    section.append(selectControl('Intensity', 'Changes rendering only.', state.intensity, [['subtle', 'Subtle'], ['balanced', 'Balanced'], ['vivid', 'Vivid']], (intensity) => update({ intensity }, 'intensity')));
    section.append(switchControl('Animation', 'Disabled whenever reduced motion is active.', state.animation, (animation) => update({ animation }, 'animation')));
    section.append(selectControl('Animation style', '', state.animationStyle, [['pulse', 'Pulse'], ['shimmer', 'Shimmer'], ['glow', 'Glow']], (animationStyle) => update({ animationStyle }, 'animation-style'), !state.animation));
    section.append(switchControl('Identity labels', 'Available by pointer and keyboard focus when enabled.', state.labels, (labels) => update({ labels }, 'labels')));
    return section;
  }
  function renderLook() {
    const state = EXP.Settings.snapshot(); const section = group('Appearance', 'Menu palette and accessibility stay separate from identity colors.');
    section.append(themeSwatches(state.uiTheme, (uiTheme) => { applyUiTheme(uiTheme); update({ uiTheme }, 'ui-theme'); }));
    const a11y = group('Accessibility', 'Non-color and spoken behavior remain independent from identity colors.');
    a11y.append(selectControl('Reduce motion', 'Follow system, always reduce, or allow configured animation.', state.reducedMotion, [['system', 'Follow system'], ['reduce', 'Reduce'], ['allow', 'Allow']], (reducedMotion) => update({ reducedMotion }, 'reduced-motion')));
    a11y.append(switchControl('High contrast', 'Uses a strong local outline and system colors where required.', state.highContrast, (highContrast) => update({ highContrast }, 'high-contrast')));
    a11y.append(selectControl('Non-color indicator', 'Visible even when hue differences are unavailable.', state.nonColorIndicator, [['underline', 'Underline'], ['outline', 'Outline'], ['off', 'Off']], (nonColorIndicator) => update({ nonColorIndicator }, 'non-color-indicator')));
    a11y.append(selectControl('Screen-reader behavior', 'Original text is the quiet default; announcements occur only on explicit navigation.', state.screenReaderBehavior, [['original-text', 'Original text'], ['announce-on-focus', 'Announce on focus']], (screenReaderBehavior) => update({ screenReaderBehavior }, 'screen-reader-behavior')));
    const fragment = document.createDocumentFragment(); fragment.append(section, a11y); return fragment;
  }
  function identityRow(identity, state) {
    const enabled = !state.disabledIdentities.includes(identity.id); const item = el('div', { class: 'identity' }); const copy = el('div', { class: 'copy' }); copy.append(el('span', { class: 'label' }, identity.label), el('span', { class: 'help' }, `${identity.terms.length} recognition term${identity.terms.length === 1 ? '' : 's'}`)); item.append(copy);
    const detail = el('div', { class: 'catalog-detail', id: `prisma-detail-${identity.id}`, hidden: true });
    if (identity.verification.status !== 'unverified') copy.querySelector('.label').append(el('span', { role: 'img', 'aria-label': 'Verified entry', title: identity.verification.status === 'wikipedia' ? 'Verified under the Wikipedia-listed rule' : 'Verified by a peer-reviewed source' }, ' ✓'));
    detail.append(el('strong', {}, identity.category), el('p', {}, identity.definition || 'Definition review pending for this inherited entry.'), el('p', {}, `Recognizes: ${identity.terms.map(term => term.text).join(', ')}`));
    if (identity.definitionStatus === 'public-reference-pending') detail.append(el('p', {}, 'Public reference review pending.'));
    if (identity.recognitionNote) detail.append(el('p', {}, identity.recognitionNote));
    const verified = identity.verification.status !== 'unverified';
    detail.append(el('p', { class: 'definition-verification' }, verified ? `✓ Verified — ${identity.verification.status === 'wikipedia' ? 'Wikipedia-listed' : 'peer-reviewed source'}` : 'Unverified — no Wikipedia or peer-reviewed reference confirmed.'));
    if (identity.romantic) detail.append(el('p', {}, state.includeRomantic ? 'Romantic identity recognition is on.' : 'Romantic identity recognition is off. Enable Romantic identities to highlight this entry.'));
    if (identity.colors.length) {
      const preview = el('div', { class: 'catalog-palette', role: 'img', 'aria-label': `${identity.label} highlight palette: ${identity.colors.join(', ')}` });
      const stops = identity.colors.flatMap((color, index) => [`${color} ${index / identity.colors.length * 100}%`, `${color} ${(index + 1) / identity.colors.length * 100}%`]);
      preview.style.backgroundImage = `linear-gradient(90deg,${stops.join(',')})`;
      detail.append(preview, el('p', {}, `${identity.flag.status === 'verified' ? 'Verified palette' : 'Inherited palette'}: ${identity.colors.join(', ')}. Palette preview, not a complete flag drawing.`));
    } else detail.append(el('p', {}, 'Flag colors await verification. This term uses a neutral underline.'));
    if (identity.flag.variant) detail.append(el('p', {}, `Flag design: ${identity.flag.variant}`));
    if (identity.flag.note) detail.append(el('p', {}, identity.flag.note));
    if (identity.flag.reviewStatus === 'unresolved') detail.append(el('p', {}, 'A public flag reference has not been confirmed.'));
    for (const url of [...new Set(identity.sources)]) detail.append(el('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, `Definition source: ${new URL(url).hostname}`));
    for (const url of [...new Set([...(identity.flag.sources || []), identity.flag.source].filter(Boolean))]) detail.append(el('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, `Flag source: ${new URL(url).hostname}`));
    const details = button('Details', () => { detail.hidden = !detail.hidden; details.setAttribute('aria-expanded', String(!detail.hidden)); product?.refresh(); }, 'compact');
    details.setAttribute('aria-expanded', 'false'); details.setAttribute('aria-controls', detail.id);
    const control = el('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(enabled), 'aria-label': `Enable ${identity.label}` }); control.append(el('span', { 'aria-hidden': 'true' })); control.addEventListener('click', () => { const disabled = new Set(EXP.Settings.snapshot().disabledIdentities); if (enabled) disabled.add(identity.id); else disabled.delete(identity.id); update({ disabledIdentities: [...disabled] }, 'identity-toggle'); });
    const actions = el('div', { class: 'identity-actions' }); actions.style.cssText='display:flex;align-items:center;gap:6px'; actions.append(control, details); item.append(actions); const wrapper = el('div', { class: 'catalog-entry' }); wrapper.append(item, detail); return wrapper;
  }
  function renderIdentities() {
    const state = EXP.Settings.snapshot(); const section = group('Identity Catalog', `${EXP.Catalog.identities.length} reviewed source identities. Context rules remain active for ambiguous terms.`); const search = el('input', { type: 'search', class: 'search', placeholder: 'Search identities and aliases', 'aria-label': 'Search identity catalog' }); const list = el('div', { class: 'identity-list' });
    let offset = 0;
    let reviewFilter = 'all';
    const pagination = el('div', { class: 'button-grid' });
    const count = el('p', { class: 'catalog-results', role: 'status' });
    section.append(switchControl('Romantic identities', '', state.includeRomantic, (includeRomantic) => update({ includeRomantic }, 'romantic-identities')));
    section.append(el('p', {}, 'Include romantic and combined aroace labels in page highlighting. Definitions stay available in this catalog.'));
    section.append(el('p', {}, 'Check marks indicate Wikipedia or peer-reviewed source support.'));
    const reviewSummary=EXP.Catalog.review;
    section.append(el('p',{},reviewSummary('definition').length+' definitions, '+reviewSummary('flag').length+' flag references, and '+reviewSummary('palette').length+' exact palettes still need evidence. These counts overlap.'));
    section.append(selectControl('Evidence review','',reviewFilter,[['all','All entries'],['definition','Definition reference needed'],['flag','Flag reference needed'],['palette','Exact palette not verified']],value=>{reviewFilter=value;offset=0;paint();}));
    const previous = button('Previous results', () => { offset = Math.max(0, offset - 3); paint(); });
    const next = button('Next results', () => { offset += 3; paint(); });
    pagination.append(previous, next);
    const paint = () => {
      const results = EXP.Catalog.search(search.value.trim()).filter(identity=>reviewFilter==='all'||EXP.Catalog.evidenceGaps(identity)[reviewFilter]);
      offset = Math.min(offset, Math.max(0, Math.floor((results.length - 1) / 3) * 3));
      list.replaceChildren(...results.slice(offset, offset + 3).map(identity => identityRow(identity, state)));
      if (!list.childElementCount) list.append(el('p', { class: 'empty' }, 'No identities match this search.'));
      count.textContent = results.length ? `${offset + 1}–${Math.min(offset + 3, results.length)} of ${results.length} entries` : '0 entries';
      previous.disabled = offset === 0; next.disabled = offset + 3 >= results.length;
      pagination.hidden = results.length <= 3; product?.refresh();
    };
    search.addEventListener('input', () => { offset = 0; paint(); }); paint(); section.append(search, list, count, pagination);
    section.append(actionRow('Restore catalog defaults', 'Enables all reviewed identities without changing context protection.', () => { update({ disabledIdentities: [] }, 'identity-defaults'); announce('Catalog defaults restored.'); }, 'Restore'));
    return section;
  }
  function renderContext() {
    const state = EXP.Settings.snapshot(); const section = group('Context Engine', 'Confidence is a deterministic rule band, never a probability.');
    section.append(selectControl('Matching mode', 'Strict accepts explicit terms; Balanced also accepts supported aliases; Inclusive permits explicitly reviewed opt-ins.', state.matcherMode, [['strict', 'Strict'], ['balanced', 'Balanced'], ['inclusive', 'Inclusive']], (matcherMode) => update({ matcherMode }, 'matcher-mode')));
    section.append(switchControl('Ambiguity Protection', 'Blocks tested competing meanings. Hard collisions remain blocked.', state.ambiguityProtection, (ambiguityProtection) => update({ ambiguityProtection }, 'ambiguity-protection')));
    section.append(switchControl('Surrounding context', 'Required-context terms fail closed when this is off.', state.surroundingContext, (surroundingContext) => update({ surroundingContext }, 'surrounding-context')));
    const d = engineState.decisions;
    section.append(statusRow('Eligible explicit', 'Exact or uniquely scoped terms.', String(d['eligible-explicit'])));
    section.append(statusRow('Eligible supported', 'Ambiguous terms with required local context.', String(d['eligible-supported'])));
    section.append(statusRow('Review ambiguous', 'Plausible terms withheld for missing support.', String(d['review-ambiguous'])));
    section.append(statusRow('Blocked negative', 'Negative context, collision, or safety rule.', String(d['blocked-negative'])));
    return section;
  }
  function renderPage() {
    const state = EXP.Settings.snapshot(); const section = group('Highlights', 'Every count and navigation action comes from one route-scoped match set.');
    section.append(switchControl('Enable PRISMA', 'Stop and fully restore PRISMA highlights while retaining settings.', state.enabled, (enabled) => update({ enabled }, 'enablement')));
    section.append(statusRow('Current-page status', `Route epoch ${engineState.routeEpoch}`, engineState.status));
    section.append(statusRow('Match count', 'Eligible current-page records.', String(engineState.total)));
    const controls = el('div', { class: 'button-grid' }); controls.append(button('Previous Match', () => { const result = EXP.Engine.navigatePrevious(); announce(result ? `Match ${result.position} of ${result.total}.` : 'No match to navigate.'); }), button('Next Match', () => { const result = EXP.Engine.navigateNext(); announce(result ? `Match ${result.position} of ${result.total}.` : 'No match to navigate.'); }), button('Highlight All', () => { EXP.Engine.highlightAll(); announce('All eligible highlights are visible.'); })); section.append(controls);
    const corrections=el('details',{class:'local-correction-card'});corrections.append(el('summary',{},'Correct an unwanted match'));
    const phrase=el('input',{'aria-label':'Phrase to leave unchanged',maxlength:'200',placeholder:'Exact phrase or short context'});
    corrections.append(phrase,button('Ignore phrase on this site',()=>{const text=phrase.value.trim();if(!text)return;const state=EXP.Settings.snapshot(),site={...(state.siteOverrides[location.hostname]||{})};site.ignoredPhrases=[...new Set([...(site.ignoredPhrases||[]),text])];update({siteOverrides:{...state.siteOverrides,[location.hostname]:site}},'local-correction');announce('Text containing this phrase will be left unchanged on this site.');}));
    for(const text of state.ignoredPhrases||[])corrections.append(button('Remove global exception: '+text,()=>update({ignoredPhrases:state.ignoredPhrases.filter(v=>v!==text)},'remove-correction')));
    for(const text of state.siteOverrides[location.hostname]?.ignoredPhrases||[])corrections.append(button('Remove site exception: '+text,()=>{const site={...state.siteOverrides[location.hostname]};site.ignoredPhrases=site.ignoredPhrases.filter(v=>v!==text);update({siteOverrides:{...state.siteOverrides,[location.hostname]:site}},'remove-correction');}));
    corrections.append(el('p',{},'Corrections stay on this device. Matching text nodes are left unchanged; nothing is submitted to a server.'));section.append(corrections);
    section.append(switchControl('Temporarily Hide Highlights', 'Session-only; matching and counts remain active.', engineState.temporarilyHidden, (value) => EXP.Engine.setTemporaryHidden(value)));
    return section;
  }
  function renderSites() {
    const state = EXP.Settings.snapshot(); const effective = EXP.Settings.effective(); const site = state.siteOverrides[location.hostname] || {}; const section = group('Current Site', location.hostname || 'Local document');
    section.append(switchControl('Enable on this site', 'Exclusion stops work and restores wrappers for this origin.', !effective.excluded, (enabled) => { const exclusions = state.exclusions.filter((host) => host !== location.hostname); if (!enabled) exclusions.push(location.hostname); update({ exclusions }, 'site-exclusion'); }));
    section.append(switchControl('Use site overrides', 'Creates or removes a current-origin override layer.', Boolean(state.siteOverrides[location.hostname]), (enabled) => { const siteOverrides = { ...state.siteOverrides }; if (enabled) siteOverrides[location.hostname] = { matcherMode: state.matcherMode }; else delete siteOverrides[location.hostname]; update({ siteOverrides }, 'site-override-layer'); }));
    section.append(selectControl('Matching mode override', 'Inherit or override the current origin.', site.matcherMode || 'inherit', [['inherit', 'Inherit global'], ['strict', 'Strict'], ['balanced', 'Balanced'], ['inclusive', 'Inclusive']], (matcherMode) => { const siteOverrides = { ...state.siteOverrides, [location.hostname]: { ...site } }; if (matcherMode === 'inherit') delete siteOverrides[location.hostname].matcherMode; else siteOverrides[location.hostname].matcherMode = matcherMode; update({ siteOverrides }, 'site-matcher-mode'); }, !state.siteOverrides[location.hostname]));
    const overrideGroup = el('div', { class: 'site-identities' });
    overrideGroup.append(el('span', { class: 'label' }, 'Identity overrides'));
    const overrideSearch = el('input', { type: 'search', class: 'search', placeholder: 'Search site identity overrides', 'aria-label': 'Search site identity overrides' }); const overrideList = el('div', { class: 'identity-list' });
    const paintOverrides = () => { overrideList.replaceChildren(...EXP.Catalog.search(overrideSearch.value).slice(0,3).map((identity) => { const value = site.identityOverrides?.[identity.id] || 'inherit'; return selectControl(identity.label, 'Current-origin behavior.', value, [['inherit', 'Inherit'], ['on', 'On'], ['off', 'Off']], (mode) => { const current = EXP.Settings.snapshot(); const siteOverrides = { ...current.siteOverrides, [location.hostname]: { ...(current.siteOverrides[location.hostname] || {}) } }; const identityOverrides = { ...(siteOverrides[location.hostname].identityOverrides || {}) }; if (mode === 'inherit') delete identityOverrides[identity.id]; else identityOverrides[identity.id] = mode; siteOverrides[location.hostname].identityOverrides = identityOverrides; update({ siteOverrides }, 'site-identity-override'); }, !state.siteOverrides[location.hostname]); })); if (!overrideList.childElementCount) overrideList.append(el('p', { class: 'empty' }, 'No identities match this search.')); };
    overrideSearch.addEventListener('input', paintOverrides); paintOverrides(); overrideGroup.append(overrideSearch, overrideList); section.append(overrideGroup);
    section.append(actionRow('Reset this site', 'Removes only this origin’s exclusion and overrides.', () => { const siteOverrides = { ...state.siteOverrides }; delete siteOverrides[location.hostname]; update({ siteOverrides, exclusions: state.exclusions.filter((host) => host !== location.hostname) }, 'site-reset'); announce('Current-site settings reset.'); }, 'Reset site'));
    return section;
  }
  function renderTools() { const fragment = document.createDocumentFragment(); fragment.append(renderIdentities(), renderContext()); return fragment; }
  function renderAppearanceMenu() {
    const fragment = document.createDocumentFragment();
    fragment.append(renderLook(), ExtraPotionsCore.createDisclosure('Highlight style', renderHighlightStyle()));
    return fragment;
  }
  function renderAdvancedMenu() {
    const fragment = document.createDocumentFragment();
    fragment.append(
      ExtraPotionsCore.createDisclosure('Language', renderTools()),
      ExtraPotionsCore.createDisclosure('Sites', renderSites())
    );
    return fragment;
  }
  function diagnosticReport() { const core = EXP.Core.diagnosticSnapshot(); return EXP.Diagnostics.createDiagnosticsReport('PRISMA', { host, settings: EXP.Settings.exportData(), updates: EXP.Updates.status(), product: { id: 'prisma', version: EXP.VERSION }, lifecycle: engineState.status, routeEpoch: engineState.routeEpoch, catalog: EXP.Catalog.status(), matches: { total: engineState.total, byIdentityId: engineState.summary, decisionBands: engineState.decisions }, processing: engineState.metrics, safeMode: EXP.Settings.snapshot().safeMode, core }); }
  function renderAdvanced() {
    const state = EXP.Settings.snapshot(); const catalog = EXP.Catalog.status(); const section = group();
    section.append(EXP.Diagnostics.createDiagnosticsControls(diagnosticReport, announce));
    section.append(switchControl('Safe Mode', 'Immediately restores the page and keeps this recovery menu available.', state.safeMode, (safeMode) => update({ safeMode }, 'safe-mode')));

    return section;
  }
  function renderSettings() {
    const state = EXP.Settings.snapshot(); const section = group();
    const preferences = ExtraPotionsCore.createDisclosure('Menu preferences');
    const data = ExtraPotionsCore.createDisclosure('Settings');
    data.open = Boolean(importDraft);
    data.append(actionRow('Rescan page', 'Rebuilds one clean route-scoped match set.', () => { EXP.Engine.rebuild('manual-rescan'); announce('Page rescanned.'); }, 'Rescan'));
    section.append(selectControl('Menu width', '', state.menuWidth, [['full','Full'],['compact','Compact'],['narrow','Narrow']], (menuWidth) => update({ menuWidth }, 'menu-width')));
    preferences.append(switchControl('Auto-close menu', 'Closes after 15 seconds without interaction.', state.menuAutoClose, (menuAutoClose) => update({ menuAutoClose }, 'menu-auto-close')));
    preferences.append(switchControl('Menu notifications', 'Shows short local status toasts.', state.menuNotifications, (menuNotifications) => update({ menuNotifications }, 'menu-notifications')));
    preferences.append(switchControl('Update notifications', 'Off by default. Opt-in checks request release metadata only.', state.updateNotifications, (updateNotifications) => { update({ updateNotifications }, 'update-notifications'); if (updateNotifications) EXP.Updates.check(true).then((result) => announce(result.available ? `Version ${result.latest} is available.` : result.state === 'failed' ? 'Update check failed quietly.' : 'PRISMA is up to date.')); }));
    const transfer = el('div', { class: 'button-grid' }); transfer.append(button('Export settings', () => download('prisma-v3-settings.json', JSON.stringify(EXP.Settings.exportData(), null, 2))));
    const importRow = row('Import PRISMA settings', 'Validation creates a draft. Apply commits atomically; Cancel changes nothing.'); const file = el('input', { type: 'file', accept: 'application/json,.json', 'aria-label': 'Import PRISMA settings' }); file.addEventListener('change', async () => { try { importDraft = EXP.Settings.prepareImport(JSON.parse(await file.files[0].text())); render(); announce('Import validated. Review and apply or cancel.'); } catch (error) { importDraft = null; announce(error.message, 'error'); } }); file.hidden = true; transfer.append(button('Import settings', () => file.click()), file); data.append(transfer);
    if (importDraft) { const actions = el('div', { class: 'button-grid' }); actions.append(button('Cancel import', () => { importDraft = null; render(); announce('Import cancelled.'); }, 'secondary'), button('Apply import', () => { EXP.Settings.replace(importDraft, 'import'); importDraft = null; render(); announce('Imported settings applied.'); }, 'primary')); data.append(actions); }
    data.append(actionRow('Reset PRISMA', 'Resets PRISMA V3 only. Other products are untouched.', () => { if (!confirm('Reset all PRISMA V3 settings?')) return; EXP.Settings.replace(EXP.Settings.defaults, 'product-reset'); render(); announce('PRISMA reset complete.'); }, 'Reset'));
    const fragment = document.createDocumentFragment(); fragment.append(section, renderAdvanced(), ExtraPotionsCore.createSystemGrid(preferences, data, ExtraPotionsCore.createCompatibilityControls())); return fragment;
  }
  const routeRenderers = { page: renderPage, appearance: renderAppearanceMenu, advanced: renderAdvancedMenu, system: renderSettings };
  function render() {
    engineState = EXP.Engine.snapshot({ includeMatchText: false });
    product?.renderActive();
    product?.refresh();
  }
  function bindKeys(event) {
    const shortcut = EXP.Settings.snapshot().shortcut;
    const defaultShortcut = event.shiftKey && event.key.toLowerCase() === 'p';
    const savedShortcut = shortcut && !event.shiftKey && `Alt+${event.key.toUpperCase()}` === shortcut.toUpperCase();
    if (event.altKey && !event.repeat && !event.ctrlKey && !event.metaKey && (defaultShortcut || savedShortcut)) {
      event.preventDefault(); product?.toggle();
    }
    if (!product?.isOpen) return;
    if (event.key === 'Escape' && importDraft) {
      event.preventDefault(); event.stopImmediatePropagation();
      importDraft = null; render(); announce('Import draft cancelled.'); return;
    }
    if (event.key === 'Tab') {
      const focusable = [...panel.querySelectorAll('button:not(:disabled),select:not(:disabled),input:not(:disabled),summary,[tabindex]:not([tabindex="-1"])')].filter(node => !node.hidden && node.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable.at(-1), active = shadow.activeElement;
      if (active === panel) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      else if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
    }
  }
  function outsidePointer(event) { if (product?.isOpen && !event.composedPath().includes(host) && !importDraft) product.close(); }
  function init() {
    if (window.top !== window.self || host) return;
    engineState = EXP.Engine.snapshot({ includeMatchText: false });
    product = ExtraPotionsCore.createProduct({
      id: 'prisma', name: 'PRISMA', version: EXP.VERSION,
      subtitle: 'Your self-identity. Recognized.', artwork: ICON_URL,
      theme: PRODUCT_THEME,
      getSettings: () => EXP.Settings.snapshot(),
      onSettings: (next, reason) => update(next, reason),
      sections: routeNames.map(([id, label]) => ({ id, label, render: () => routeRenderers[id]() })),
    });
    ({ host, shadow, launcher, panel } = product);
    EXP.Core.injectStyle(shadow, '.catalog-detail{padding:8px;margin:4px 0 8px;border:1px solid var(--theme-line);border-radius:7px;background:var(--theme-bg);font-size:10px;line-height:1.45;overflow-wrap:anywhere}.catalog-detail[hidden]{display:none!important}.catalog-detail p{margin:6px 0}.catalog-detail a{display:block;color:var(--theme-accent2);margin-top:5px}.catalog-palette{height:20px;border:1px solid var(--theme-line);border-radius:4px}', { expPrismaCatalog: '1' });
    panel.classList.add('panel');
    panel.setAttribute('aria-modal', 'true');
    const nav = panel.querySelector('nav');
    nav.classList.add('nav');
    for (const item of nav.querySelectorAll('[data-section]')) {
      item.classList.add('route');
      const body = item.parentElement.querySelector('.route-body');
      body.id = `exp-prisma-route-${item.dataset.section}`;
      item.setAttribute('aria-controls', body.id);
    }
    const syncSectionState = () => {
      for (const item of nav.querySelectorAll('[data-section]')) item.setAttribute('aria-current', item.getAttribute('aria-expanded') === 'true' ? 'page' : 'false');
    };
    nav.addEventListener('click', syncSectionState);
    launcher.addEventListener('click', syncSectionState);
    live = el('p', { class: 'live', role: 'status', 'aria-live': 'polite' });
    panel.querySelector('nav').before(live);
    toast = el('div', { class: 'toast', role: 'status', 'aria-live': 'polite', hidden: true });
    (shadow.querySelector('.exp-core-theme') || shadow).append(toast);
    noticeController = ExtraPotionsCore.createProductNotice({
      host, shadow, panel, versionButton: product.versionButton,
      releaseUrl: 'https://github.com/ExtraPotions/PRISMA/releases',
      installUrl: 'https://github.com/ExtraPotions/PRISMA/releases/latest/download/prisma.user.js',
      onVersion: () => {
        if (updateCard?.hidden === false && updateCard.dataset.noticeKind === 'current') hideUpdateCard();
        else showNotice(updateCard, { kicker:'Current Version', title:'PRISMA Changelog', version:EXP.VERSION, text:`What's new in v${EXP.VERSION}.`, details:EXP.ReleaseNotes.current(), available:false });
      },
    });
    updateCard = noticeController.element;
    applyUiTheme(EXP.Settings.snapshot().uiTheme);
    const previous = EXP.Core.consumeVersionChange('prisma', EXP.VERSION, 'exp:v3:prisma:last-version-v2');
    if (previous) showUpdateCard({}, true, previous);
    if (EXP.Settings.snapshot().updateNotifications) EXP.Updates.check(false).then(result => { if (host && result.available) showUpdateCard(result); });
    unsubscribe = EXP.Engine.subscribe(value => {
      engineState = value;
      if (product?.isOpen && panel.querySelector('[data-section="page"][aria-expanded="true"],[data-section="system"][aria-expanded="true"]')) render();
    });
    document.addEventListener('keydown', bindKeys, true);
    document.addEventListener('pointerdown', outsidePointer, true);
    render();
  }
  function cleanup() {
    document.removeEventListener('keydown', bindKeys, true);
    document.removeEventListener('pointerdown', outsidePointer, true);
    unsubscribe?.(); clearTimeout(toastTimer); noticeController?.destroy(); product?.destroy();
    host = shadow = launcher = panel = live = toast = product = noticeController = updateCard = null;
    importDraft = null;
  }
  return Object.freeze({ init, cleanup, open: () => product?.open(), refresh: render });
})();

EXP.VERSION = '3.1.12';
ExtraPotionsCore.registerDiagnosticsProduct('prisma', EXP.VERSION);
EXP.App = (() => {
  let scheduler, navigationCleanup, settingsCleanup, presentationCleanup, lifecycle;
  const ready = () => document.body ? Promise.resolve() : new Promise((resolve) => addEventListener('DOMContentLoaded', resolve, { once: true }));
  async function initialize() {
    EXP.Settings.load();
    await ready();
    scheduler = EXP.Core.createScheduler((roots) => EXP.Engine.processBatch(roots), { source: 'prisma', characterData: true });
    presentationCleanup = globalThis.ExtraPotionsCore?.observePresentationState?.((event, root) => {
      if (event.source !== 'ward' || event.phase) return;
      scheduler.schedule(root);
    }, { source: 'ward' });
    navigationCleanup = EXP.Core.onNavigation(() => EXP.Engine.navigation());
    settingsCleanup = EXP.Settings.subscribe(() => EXP.Engine.rebuild('settings'));
    EXP.UI.init();
  }
  async function enable() {
    EXP.Engine.start();
    scheduler.start();
    if (EXP.Settings.snapshot().updateNotifications) EXP.Updates.check();
  }
  async function disable() { scheduler.stop(); EXP.Engine.stop(); }
  async function cleanup() { scheduler?.stop(); presentationCleanup?.(); settingsCleanup?.(); navigationCleanup?.(); EXP.UI.cleanup(); EXP.Engine.cleanup(); }
  function start() {
    lifecycle = EXP.Core.register({ id: 'prisma', version: EXP.VERSION, coreRange: '^3.3.4', capabilities: ['lifecycle', 'settings', 'diagnostics', 'dom-scheduler', 'navigation', 'launcher', 'ui'] }, { initialize, enable, disable, cleanup });
    lifecycle.initialize().then(() => lifecycle.enable()).catch((error) => EXP.Core.safeError(error, 'prisma'));
    return lifecycle;
  }
  return Object.freeze({ start, get lifecycle() { return lifecycle; } });
})();
EXP.App.start();
})();
