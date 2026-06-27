import { useEffect, useRef } from 'react';

type NuiHandler<T> = (data: T) => void;

/**
 * Listen for NUI messages with a flat payload shape: `{ action, ...fields }`.
 */
export function useNuiEvent<T extends Record<string, unknown>>(
  action: string,
  handler: NuiHandler<T>,
) {
  const savedHandler = useRef(handler);
  savedHandler.current = handler;

  useEffect(() => {
    const listener = (event: Event) => {
      const messageEvent = event as MessageEvent<T & { action?: string }>;
      const payload =
        messageEvent.data ?? (event as CustomEvent<T & { action?: string }>).detail;

      if (payload?.action !== action) return;
      savedHandler.current(payload as T);
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [action]);
}
