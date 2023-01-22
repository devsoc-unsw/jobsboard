import { createContext } from 'react';

type Context = {
  apiToken: string | null;
  setApiToken: (apiToken: string) => void;
  resetApiToken: () => void;
};

const AppContext = createContext<Context>({
  apiToken: null,
  setApiToken: () => undefined,
  resetApiToken: () => undefined
});

export default AppContext;
