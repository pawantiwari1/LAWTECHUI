import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your API's base URL
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
