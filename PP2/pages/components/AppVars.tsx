import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface GlobalContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<GlobalContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const theme = localStorage.getItem('theme') ?? 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    setTheme(theme);
  }, []);

  


  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

