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
