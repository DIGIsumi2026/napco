export function shouldUseRichEffects() {
  if (typeof window === 'undefined' || window.innerWidth <= 1024) return false;

  const device = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };

  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !device.connection?.saveData &&
    !['slow-2g', '2g', '3g'].includes(device.connection?.effectiveType ?? '') &&
    (device.hardwareConcurrency === undefined || device.hardwareConcurrency > 4) &&
    (device.deviceMemory === undefined || device.deviceMemory > 4);
}
