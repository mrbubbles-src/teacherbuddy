export function startVt(
  cb: () => void,
  ev?: { clientX: number; clientY: number },
) {
  if (typeof document === 'undefined') return cb();

  // Reduced motion respektieren
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
    return cb();

  // Koordinaten in % → CSS-Variablen, die dein circle-in nutzen
  if (ev) {
    const x = Math.round((ev.clientX / window.innerWidth) * 100);
    const y = Math.round((ev.clientY / window.innerHeight) * 100);
    const root = document.documentElement;
    root.style.setProperty('--vt-x', `${x}%`);
    root.style.setProperty('--vt-y', `${y}%`);
  }

  // Nur wenn unterstützt – sonst einfach direkt umschalten
  const anyDoc = document as unknown as {
    startViewTransition?: (cb: () => void) => void;
  };
  if (typeof anyDoc.startViewTransition === 'function') {
    // Wichtig: Methode mit gebundenem `this` aufrufen, sonst "Illegal invocation"
    anyDoc.startViewTransition(() => cb());
    return;
  }
  return cb();
}
