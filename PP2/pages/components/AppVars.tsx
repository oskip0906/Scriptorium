import React, { createContext, useState, ReactNode } from 'react';

interface GlobalContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<GlobalContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

