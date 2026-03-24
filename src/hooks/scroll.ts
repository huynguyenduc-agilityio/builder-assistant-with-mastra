import { useEffect, type RefObject } from 'react';

const SCROLL_DELAY = 80;

const findScrollParent = (el: HTMLElement): HTMLElement | null => {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  // Fallback: CopilotKit container by class name
  return document.querySelector('.copilotKitScrollContainer');
};

export const useScrollToBottom = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = ref.current;
      if (!el) return;

      const container = findScrollParent(el);
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }, SCROLL_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
