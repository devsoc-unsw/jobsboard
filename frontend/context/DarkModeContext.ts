import React, { createContext } from 'react';

type Context = {
  darkMode: boolean | null;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const DarkModeContext = createContext<Context>({
  darkMode: null,
  setDarkMode: () => undefined
});

export default DarkModeContext;
