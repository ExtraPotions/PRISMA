EXP.Updates = ExtraPotionsCore.createReleaseUpdateChecker({
  productId: 'prisma',
  repository: 'ExtraPotions/PRISMA',
  endpoint: 'https://api.github.com/repos/ExtraPotions/PRISMA/releases/latest',
  currentVersion: EXP.VERSION,
  enabled: () => EXP.Settings.snapshot().updateNotifications,
  onError: error => EXP.Core.safeError(Object.assign(error, { code: 'UPDATE_CHECK' }), 'prisma'),
});
