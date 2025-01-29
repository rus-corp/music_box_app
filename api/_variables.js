import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const baseUrl = 'https://music-sol.ru/api'


const getAccessToken = async () => {
  const token = await AsyncStorage.getItem('access_token')
  return token
}

const getRefreshToken = async() => {
  const token = await AsyncStorage.getItem('refresh_token')
  return token
}


export const backend  = axios.create({
  baseURL: baseUrl,
  headers: {'Content-Type': 'application/json',}
})


export const authBackend = axios.create({
  baseURL: 'https://music-sol.ru/api'
})


backend.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


backend.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const originalRequest = error.config
  if (error?.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token')
      const response = await backend.post(
        '/auth/refresh',
        {'refresh_token': refreshToken}
      )
      const accessToken = response.data.access_token
      await AsyncStorage.setItem('access_token', accessToken)
      backend.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      return backend(originalRequest)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  return Promise.reject(error)
})