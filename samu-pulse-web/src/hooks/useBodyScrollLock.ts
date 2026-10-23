import {useEffect} from 'react';

const locks = new Set<symbol>();
let previousOverflow = '';

export const lockBodyScroll = () => {
  const lock = Symbol();
  if (locks.size === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  locks.add(lock);

  return () => {
    if (!locks.delete(lock)) return;
    if (locks.size === 0) document.body.style.overflow = previousOverflow;
  };
};

export const useBodyScrollLock = (active: boolean) => {
  useEffect(() => {
    if (active) return lockBodyScroll();
  }, [active]);
};
