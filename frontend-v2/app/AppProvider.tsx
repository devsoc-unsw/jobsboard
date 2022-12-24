"use client"
import React, { useState } from 'react'
import AppContext from './AppContext';

type Props = {
  children: React.ReactNode
}

const AppProvider = ({ children }: Props) => {
  const [apiToken, setApiToken] = useState<string | null>(null);
  return (
    <AppContext.Provider value={{ apiToken, setApiToken: (api) => setApiToken(api), resetApiToken: () => setApiToken(null)
     }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider