import axios from 'axios';
import NProgress from 'nprogress';
NProgress.configure({ showSpinner: false });

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000//', // Replace with your API base URL
  timeout: 30000, // Timeout after 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});

export const ERR_BAD_REQUEST = "ERR_BAD_REQUEST"
export default axiosInstance;