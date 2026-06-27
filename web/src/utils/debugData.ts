import { isEnvBrowser } from './env';

interface DebugEvent {
  action: string;
  [key: string]: unknown;
}

/**
 * Emulates SendNUIMessage while developing in the browser.
 */
export const debugData = (events: DebugEvent[], timer = 1000): void => {
  if (import.meta.env.DEV && isEnvBrowser()) {
    for (const event of events) {
      setTimeout(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: event,
          }),
        );
      }, timer);
    }
  }
};
