'use client';

import React, { useState } from 'react';
import ThemeContext from './ThemeContext';

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        theme: darkMode ? 'dark' : 'light',
        toggleTheme: () => {
          if (darkMode) document.documentElement.classList.remove('dark');
          else document.documentElement.classList.add('dark');

          // Note that this setter is below the above state change as
          //  theme state value does not update immediately
          setDarkMode(!darkMode);
        }
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
