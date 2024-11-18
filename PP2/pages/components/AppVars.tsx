import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface GlobalContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
<<<<<<< Updated upstream
=======
  userID: string | null;
  setUserID: React.Dispatch<React.SetStateAction<string | null>>;
  admin: string | null;
  setAdmin: React.Dispatch<React.SetStateAction<string | null>>;
>>>>>>> Stashed changes
}

export const AppContext = createContext<GlobalContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light');
<<<<<<< Updated upstream
=======
  const [userID, setUserID] = useState<string | null>(null);
  const [admin, setAdmin] = useState<string | null>("none");
>>>>>>> Stashed changes

  useEffect(() => {
    const theme = localStorage.getItem('theme') ?? 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    setTheme(theme);
  }, []);

  


  return (
<<<<<<< Updated upstream
    <AppContext.Provider value={{ theme, setTheme }}>
=======
    <AppContext.Provider value={{ theme, setTheme, userID, setUserID, admin, setAdmin }}>
>>>>>>> Stashed changes
      {children}
    </AppContext.Provider>
  );
};

