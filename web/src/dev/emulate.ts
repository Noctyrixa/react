import { NUI_ACTIONS } from '../constants/events';

const ACTION_ALIASES: Record<string, string> = {
  open: NUI_ACTIONS.OPEN,
  close: NUI_ACTIONS.CLOSE,
};

export function setupEmulate(): void {
  window.emulate = (action, detail = {}) => {
    const resolved = ACTION_ALIASES[action] ?? action;

    window.dispatchEvent(
      new CustomEvent('message', {
        detail: { action: resolved, ...detail },
      }),
    );
  };
}

declare global {
  interface Window {
    emulate?: (action: string, detail?: Record<string, unknown>) => void;
  }
}
