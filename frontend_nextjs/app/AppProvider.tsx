'use client';
import React, { useState } from 'react';
import AppContext from './AppContext';

type AppProviderProps = {
  children: React.ReactNode;
};

const sessionStorageApiTokenKeyName = 'jobs-board-api-token';

const AppProvider = ({ children }: AppProviderProps) => {
  const [apiToken, setApiToken] = useState<string | null>(null);
  return (
    <AppContext.Provider
      value={{
        apiToken: apiToken || sessionStorage.getItem(sessionStorageApiTokenKeyName),
        setApiToken: (token) => {
          setApiToken(token);
          sessionStorage.setItem(sessionStorageApiTokenKeyName, token);
        },
        resetApiToken: () => {
          setApiToken(null);
          sessionStorage.removeItem(sessionStorageApiTokenKeyName);
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
