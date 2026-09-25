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
@keyframes exp-prisma-pulse{0%,100%{opacity:1}50%{opacity:.65}}
@media(prefers-reduced-motion:reduce){.${HIT}[data-motion="system"]{animation:none!important}}
@media(forced-colors:active){.${HIT}{background:none!important;color:CanvasText!important;-webkit-text-fill-color:CanvasText!important;outline:1px solid Highlight;text-decoration:underline}}
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
    const colors = record.identity.colors;
    const levels = { subtle: ['2px', '14%'], balanced: ['3px', '22%'], vivid: ['4px', '32%'] };
    span.dataset.style = settings.style;
    span.dataset.indicator = settings.nonColorIndicator;
    span.dataset.contrast = settings.highContrast ? '1' : '0';
    span.dataset.animate = settings.animation && settings.reducedMotion !== 'reduce' ? '1' : '0';
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
    applyInlineVisual(span, hidden || settings.highContrast ? 'off' : settings.style, colors[0], levels[settings.intensity][0], softFill);
    span.title = settings.labels ? record.identity.label : '';
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
