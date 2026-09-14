export interface NetworkInfo {
  online: boolean;
  effectiveType?: string;
  downlinkMbps?: number;
  saveData?: boolean;
}

interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  saveData?: boolean;
  addEventListener: (type: 'change', listener: () => void) => void;
  removeEventListener: (type: 'change', listener: () => void) => void;
}

const getConnection = (): NetworkInformation | undefined => {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
};

export const getNetworkInfo = (): NetworkInfo => {
  const conn = getConnection();

  return {
    online: navigator.onLine,
    effectiveType: conn?.effectiveType,
    downlinkMbps: conn?.downlink,
    saveData: conn?.saveData,
  };
};

export const subscribeToNetwork = (onChange: () => void): (() => void) => {
  const conn = getConnection();
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  conn?.addEventListener('change', onChange);

  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
    conn?.removeEventListener('change', onChange);
  };
};