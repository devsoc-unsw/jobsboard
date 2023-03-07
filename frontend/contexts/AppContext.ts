import { createContext } from 'react';

export type AppContextProps = {
  apiToken: string | null;
  setApiToken: (apiToken: string) => void;
  resetApiToken: () => void;
};

const AppContext = createContext<AppContextProps>({
  apiToken: null,
  setApiToken: () => undefined,
  resetApiToken: () => undefined
});

export default AppContext;
