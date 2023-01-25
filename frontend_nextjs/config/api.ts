import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:8080/',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
});

export default api;
