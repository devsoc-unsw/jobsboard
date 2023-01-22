'use client';
import React, { useState } from 'react';
import AppContext from './AppContext';

type AppProviderProps = {
  children: React.ReactNode;
};

const sessionStorageApiTokenKeyName = 'jobs-board-api-token';

const getAPILocalStorageToken = () => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.getItem(sessionStorageApiTokenKeyName);
  }
  return null;
};

const setAPILocalStorageToken = (token: string) => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(sessionStorageApiTokenKeyName, token);
  }
  return null;
};

const removeAPILocalStorageToken = () => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(sessionStorageApiTokenKeyName);
  }
  return null;
};

const AppProvider = ({ children }: AppProviderProps) => {
  const [apiToken, setApiToken] = useState<string | null>(null);
  return (
    <AppContext.Provider
      value={{
        apiToken: apiToken || getAPILocalStorageToken(),
        setApiToken: (token) => {
          setApiToken(token);
          setAPILocalStorageToken(token);
        },
        resetApiToken: () => {
          setApiToken(null);
          removeAPILocalStorageToken();
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
