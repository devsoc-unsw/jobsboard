import { createContext } from 'react';

type Context = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<Context>({
  theme: 'light',
  toggleTheme: () => undefined
});

export default ThemeContext;
