import {ComponentType, useEffect, useState} from 'react';

// Não disputar banda e processamento com a primeira renderização.
export const PwaBootstrap = () => {
  const [Status, setStatus] = useState<ComponentType | null>(null);

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let idle: number | undefined;
    let started = false;
    const load = () => {
      if (disposed || started) return;
      started = true;
      void import('./PwaStatus').then(module => {
        if (!disposed) setStatus(() => module.PwaStatus);
      }).catch(() => {
        // Falha no suporte PWA nunca impede abrir ou usar o aplicativo.
        started = false;
      });
    };
    const schedule = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idle = window.requestIdleCallback(load, {timeout: 5000});
        } else {
          load();
        }
      }, 3000);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, {once: true});
    window.addEventListener('online', schedule);
    return () => {
      disposed = true;
      clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.removeEventListener('load', schedule);
      window.removeEventListener('online', schedule);
    };
  }, []);

  return Status ? <Status /> : null;
};
