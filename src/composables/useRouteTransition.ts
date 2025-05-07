import { ref } from 'vue';
import { createGlobalState } from '@vueuse/core';

export const useRouteTransition = createGlobalState(() => {
  const isPending = ref(false);
  const resolvers = new Set<() => void>();

  const waitForTransition = () => {
    if (!isPending.value) return Promise.resolve();

    return new Promise<void>((resolve) => {
      resolvers.add(resolve);
    });
  };

  const startTransition = () => {
    isPending.value = true;
  };

  const completeTransition = () => {
    isPending.value = false;
    resolvers.forEach(resolve => resolve());
    resolvers.clear();
  };

  return {
    isPending,
    waitForTransition,
    startTransition,
    completeTransition
  };
});
