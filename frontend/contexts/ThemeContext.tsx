import { createContext } from 'react';

export type ThemeContextProps = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => undefined
});

export default ThemeContext;
