import axios from 'axios';

import {logout, updateToken} from '@/store/authSlice';
import store from "@/store/store";


const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;


const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}/users/refresh/`, { refresh: refreshToken });
    return response.data;
  } catch (error) {
    throw error;
  }
};


const axiosInstance = axios.create({
  baseURL: API_URL,
});



axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { auth } = store.getState();

    if (error.response.status === 401 && !originalRequest._retry && auth.refresh_token) {
      originalRequest._retry = true;
      try {
        console.log('Attempting to refresh access token...');
        const newTokens = await refreshAccessToken(auth.refresh_token);
        console.log('New tokens received', newTokens);

        store.dispatch(updateToken(newTokens));
        originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
