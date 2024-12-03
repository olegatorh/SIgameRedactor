import axios from 'axios';
import Cookies from 'js-cookie'; // Якщо кукі не HttpOnly
import { logout } from '@/store/authSlice';
import {useDispatch} from "react-redux";


const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/users/refresh/`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const dispatch = useDispatch();


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newTokens = await refreshAccessToken();

        originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
