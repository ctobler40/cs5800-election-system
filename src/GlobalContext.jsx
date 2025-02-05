import React, { createContext, useState } from 'react';

// Create a Context
export const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
  const [loginID, setLoginID] = useState(-1);

  return (
    <GlobalContext.Provider value={{ loginID, setLoginID }}>
      {children}
    </GlobalContext.Provider>
  );
};
