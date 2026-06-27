import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { NUI_ACTIONS } from './constants/events';
import { setupEmulate } from './dev/emulate';
import { VisibilityProvider } from './providers/VisibilityProvider';
import { isEnvBrowser } from './utils/env';
import './index.css';

setupEmulate();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VisibilityProvider
      defaultVisible={isEnvBrowser()}
      showActions={[NUI_ACTIONS.OPEN]}
      hideActions={[NUI_ACTIONS.CLOSE]}
    >
      <App />
    </VisibilityProvider>
  </StrictMode>,
);
