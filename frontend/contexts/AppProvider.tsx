'use client';

import React, { useMemo, useState } from 'react';
import Cookies from 'universal-cookie';
import { authTokenKey } from 'config/api';
import AppContext, { AppContextProps } from './AppContext';

type AppProviderProps = {
  children: React.ReactNode;
};

const cookies = new Cookies();

const AppProvider = ({ children }: AppProviderProps) => {
  const [apiToken, setApiToken] = useState<string | null>(
    (cookies.get(authTokenKey) as string) || null
  );

  const value = useMemo(
    (): AppContextProps => ({
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
    }),
    [apiToken]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
