import { createContext } from 'react';

const EtherContext = createContext({
  account: null,
  contract: null,
});

export default EtherContext;