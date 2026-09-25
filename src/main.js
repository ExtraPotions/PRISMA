EXP.VERSION = '3.0.31';
ExtraPotionsCore.registerDiagnosticsProduct('prisma', EXP.VERSION);
EXP.App = (() => {
  let scheduler, navigationCleanup, settingsCleanup, lifecycle;
  const ready = () => document.body ? Promise.resolve() : new Promise((resolve) => addEventListener('DOMContentLoaded', resolve, { once: true }));
  async function initialize() {
    EXP.Settings.load();
    await ready();
    scheduler = EXP.Core.createScheduler((roots) => EXP.Engine.processBatch(roots), { source: 'prisma', characterData: true });
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
  async function cleanup() { scheduler?.stop(); settingsCleanup?.(); navigationCleanup?.(); EXP.UI.cleanup(); EXP.Engine.cleanup(); }
  function start() {
    lifecycle = EXP.Core.register({ id: 'prisma', version: EXP.VERSION, capabilities: ['lifecycle', 'settings', 'diagnostics', 'dom-scheduler', 'navigation', 'launcher', 'ui'] }, { initialize, enable, disable, cleanup });
    lifecycle.initialize().then(() => lifecycle.enable()).catch((error) => EXP.Core.safeError(error, 'prisma'));
    return lifecycle;
  }
  return Object.freeze({ start, get lifecycle() { return lifecycle; } });
})();
EXP.App.start();
