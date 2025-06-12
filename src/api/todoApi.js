import axios from 'axios';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },

  timeout: 10000,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simple response interceptor to handle auth token expiration
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If unauthorized (401), clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Pass through the error message from backend
    return Promise.reject(error.response?.data?.message || 'Something went wrong');
  }
);

export const todoApi = {
  // Auth endpoints
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.token);
    return response;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    localStorage.setItem('token', response.token);
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getUserProfile: async () => {
    return api.get('/auth/profile');
  },

  // Todo endpoints
  getTodos: async () => {
    return api.get('/todos');
  },

  createTodo: async (title) => {
    return api.post('/todos', { title });
  },

  updateTodo: async (id, updates) => {
    return api.patch(`/todos/${id}`, updates);
  },

  deleteTodo: async (id) => {
    return api.delete(`/todos/${id}`);
  },
}; 