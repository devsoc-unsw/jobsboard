import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jobsboard.csesoc.unsw.edu.au/api/',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
});

export const authTokenKey = 'jb-token';

export default api;
