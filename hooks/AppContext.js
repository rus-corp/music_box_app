import React from 'react';


export const AppContext = React.createContext()


export default function AppProvider({ children }) {
  const [user, setUser] = React.useState(null)
  return(
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}