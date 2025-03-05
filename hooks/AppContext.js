import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';


export const AppContext = React.createContext()

const getUserToken = async () => {
  return await AsyncStorage.getItem('access_token')
}

export default function AppProvider({ children }) {
  const [user, setUser] = React.useState(null)
  
  React.useEffect(() => {
    const fetchToken = async() => {
      const token = await getUserToken()
      setUser(token)
    }
    fetchToken()
  }, [])

  return(
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}