import React, { createContext } from 'react';

type Context = {
  darkMode: boolean | null;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const ThemeContext = createContext<Context>({
  darkMode: null,
  setDarkMode: () => undefined
});

export default ThemeContext;
