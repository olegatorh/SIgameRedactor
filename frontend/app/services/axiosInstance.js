import axios from 'axios';
import Cookies from "js-cookie";


const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/users/token/refresh/`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Successful response:', response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log('Error intercepted:', error.response);
    console.log('originalRequest._retry:', originalRequest._retry);
    console.log('originalRequest._retry:', originalRequest);
    console.log('error.response.status:', error.response.status);
    console.log('error.response?.status:', error.response?.status);

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      console.log('Attempting token refresh...');
      originalRequest._retry = true;
      try {
        // const newTokens = await refreshAccessToken();
        // originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
        await refreshAccessToken();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);
        return Promise.reject(refreshError);
      }
    }

    console.error('Request failed:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export default axiosInstance;
