'use client';
import React, { useState } from 'react';
import AppContext from './AppContext';

type Props = {
  children: React.ReactNode;
};

const sessionStorageApiTokenKeyName = 'jobs-board-api-token';

const AppProvider = ({ children }: Props) => {
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
