import { useEventListener } from '@vueuse/core';

export function useTouchFeedback() {
  const isPressed = ref(false);
  const elementRef = ref<HTMLElement>();

  useEventListener(elementRef, 'touchstart', () => {
    isPressed.value = true;
  }, { passive: true });

  useEventListener(elementRef, 'touchend', () => {
    setTimeout(() => {
      isPressed.value = false;
    }, 150);
  }, { passive: true });

  useEventListener(elementRef, 'touchcancel', () => {
    isPressed.value = false;
  }, { passive: true });

  return {
    elementRef,
    isPressed
  };
}
