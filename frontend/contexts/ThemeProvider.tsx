'use client';

import React, { useMemo, useState } from 'react';
import ThemeContext, { ThemeContextProps } from './ThemeContext';

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState(false);

  const value = useMemo(
    (): ThemeContextProps => ({
      theme: darkMode ? 'dark' : 'light',
      toggleTheme: () => {
        if (darkMode) document.documentElement.classList.remove('dark');
        else document.documentElement.classList.add('dark');

        setDarkMode((prevState) => !prevState);
      }
    }),
    [darkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
