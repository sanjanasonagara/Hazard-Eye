import React, { createContext, useState, useContext, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

const OfflineContext = createContext();

export const useOffline = () => useContext(OfflineContext);

export default function OfflineProvider({ children }) {
  const [isOffline, setIsOffline] = useState(true);
  const [storedReports, setStoredReports] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    // Simulate initial stored reports
    setStoredReports(3);

    return () => unsubscribe();
  }, []);

  const incrementStoredReports = () => {
    setStoredReports(prev => prev + 1);
  };

  const decrementStoredReports = () => {
    setStoredReports(prev => Math.max(0, prev - 1));
  };

  return (
    <OfflineContext.Provider 
      value={{ 
        isOffline, 
        storedReports, 
        incrementStoredReports, 
        decrementStoredReports 
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}