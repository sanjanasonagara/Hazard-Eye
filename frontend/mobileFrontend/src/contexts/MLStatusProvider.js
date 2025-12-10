import React, { createContext, useState, useContext } from 'react';

const MLStatusContext = createContext();

export const useMLStatus = () => useContext(MLStatusContext);

export default function MLStatusProvider({ children }) {
  const [mlModelLoaded, setMlModelLoaded] = useState(true);
  const [mlVersion, setMlVersion] = useState('2.1.0');
  const [lastUpdate, setLastUpdate] = useState('2024-01-15');

  return (
    <MLStatusContext.Provider 
      value={{ 
        mlModelLoaded, 
        mlVersion, 
        lastUpdate 
      }}
    >
      {children}
    </MLStatusContext.Provider>
  );
}