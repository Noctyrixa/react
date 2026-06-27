import { useEffect, useState } from 'react';
import { NUI_CALLBACKS } from '../constants/events';
import { useVisibility } from '../providers/VisibilityProvider';
import { debugData } from '../utils/debugData';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/env';
import './App.css';

debugData([{ action: 'open' }]);

interface ReturnData {
  x: number;
  y: number;
  z: number;
}

const MOCK_CLIENT_DATA: ReturnData = { x: 500, y: 300, z: 200 };

function ReturnClientDataComp({ data }: { data: unknown }) {
  return (
    <>
      <h5>Returned Data:</h5>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </>
  );
}

export default function App() {
  const { visible, setVisible } = useVisibility();
  const [clientData, setClientData] = useState<ReturnData | null>(null);

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (event: KeyboardEvent) => {
      if (!['Backspace', 'Escape'].includes(event.code)) return;

      if (isEnvBrowser()) {
        setVisible(false);
        return;
      }

      fetchNui(NUI_CALLBACKS.HIDE_FRAME);
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [setVisible, visible]);

  const handleGetClientData = async () => {
    const retData = await fetchNui<ReturnData>(
      NUI_CALLBACKS.GET_CLIENT_DATA,
      undefined,
      MOCK_CLIENT_DATA,
    );

    console.log('Got return data from client scripts:');
    console.dir(retData);
    setClientData(retData);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="nui-wrapper">
      <div className="popup-thing">
        <div>
          <h1>This is the NUI Popup!</h1>
          <p>Exit with the escape key</p>
          <button type="button" onClick={handleGetClientData}>
            Get Client Data
          </button>
          {clientData && <ReturnClientDataComp data={clientData} />}
        </div>
      </div>
    </div>
  );
}
