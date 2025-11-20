import { useCallback, useEffect, useRef, useState } from 'react';

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const previousOverflow = useRef<string | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const { body } = document;

    if (isOpen) {
      if (previousOverflow.current === null) {
        previousOverflow.current = body.style.overflow;
      }
      body.style.overflow = 'hidden';
    } else if (previousOverflow.current !== null) {
      body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }

    return () => {
      if (previousOverflow.current !== null) {
        body.style.overflow = previousOverflow.current;
        previousOverflow.current = null;
      }
    };
  }, [isOpen]);

  return { isOpen, open, close, toggle };
};
