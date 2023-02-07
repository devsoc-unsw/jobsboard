'use client';

import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { authTokenKey } from 'config/api';
import AppContext from './AppContext';

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  const cookies = new Cookies();
  const [apiToken, setApiToken] = useState<string | null>(cookies.get(authTokenKey));

  return (
    <AppContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        apiToken,
        setApiToken: (token) => {
          cookies.set(authTokenKey, token, {
            path: '/',
            sameSite: true
          });
          setApiToken(token);
        },
        resetApiToken: () => {
          cookies.remove(authTokenKey, { path: '/' });
          setApiToken(null);
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
