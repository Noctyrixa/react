import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { isEnvBrowser } from '../utils/env';

interface VisibilityContextValue {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  shouldHide: boolean;
  setShouldHide: (hide: boolean) => void;
}

const VisibilityContext = createContext<VisibilityContextValue | null>(null);

interface VisibilityProviderProps {
  children: ReactNode;
  defaultVisible?: boolean;
  defaultShouldHide?: boolean;
  showActions?: string[];
  hideActions?: string[];
  hideStateAction?: string;
}

export function VisibilityProvider({
  children,
  defaultVisible = false,
  defaultShouldHide = !isEnvBrowser(),
  showActions = [],
  hideActions = [],
  hideStateAction,
}: VisibilityProviderProps) {
  const [visible, setVisible] = useState(defaultVisible);
  const [shouldHide, setShouldHide] = useState(defaultShouldHide);

  const showActionKey = showActions.join('|');
  const hideActionKey = hideActions.join('|');

  useEffect(() => {
    const listener = (event: Event) => {
      const messageEvent = event as MessageEvent<{
        action?: string;
        shouldHide?: boolean;
        hideState?: number;
      }>;
      const payload =
        messageEvent.data ?? (event as CustomEvent<{ action?: string }>).detail;

      if (!payload?.action) return;

      if (showActions.includes(payload.action)) {
        setVisible(true);
      }

      if (hideActions.includes(payload.action)) {
        setVisible(false);
      }

      if (hideStateAction && payload.action === hideStateAction) {
        if (payload.shouldHide !== undefined) {
          setShouldHide(payload.shouldHide);
        } else if (payload.hideState !== undefined) {
          setShouldHide(payload.hideState === 2);
        }
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [hideActionKey, hideStateAction, showActionKey]);

  const value = useMemo(
    () => ({
      visible,
      setVisible,
      shouldHide,
      setShouldHide,
    }),
    [shouldHide, visible],
  );

  return (
    <VisibilityContext.Provider value={value}>{children}</VisibilityContext.Provider>
  );
}

export function useVisibility() {
  const context = useContext(VisibilityContext);

  if (!context) {
    throw new Error('useVisibility must be used within VisibilityProvider');
  }

  return context;
}

export function useVisibilityControls() {
  const { visible, setVisible } = useVisibility();

  const show = useCallback(() => setVisible(true), [setVisible]);
  const hide = useCallback(() => setVisible(false), [setVisible]);
  const toggle = useCallback(() => setVisible((current) => !current), [setVisible]);

  return { visible, setVisible, show, hide, toggle };
}
