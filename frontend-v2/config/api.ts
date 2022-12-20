import axios from "axios";

// const api = {
//   baseURL: 'https://jobsboard.csesoc.unsw.edu.au/api',
//   // baseURL: 'https://jobsboard.staging.csesoc.unsw.edu.au/api',
//   // baseURL: 'http://127.0.0.1:8080',
//   sessionStorageApiTokenKeyName: 'jobs-board-api-token',
// };

const api = axios.create({
  baseURL: 'https://jobsboard.staging.csesoc.unsw.edu.au/api',
  // baseURL: 'http://localhost:8080/',
  timeout: 1000,
  headers: {'Content-Type': 'application/json', 'Accept': 'application/json' }
});


export default api;