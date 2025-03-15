import axios from 'axios';
import queryString from 'query-string';


const httpRequest = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    serialize: (params) => {
      console.log(process.env.REACT_APP_BASE_URL)
      return queryString.stringify(params, { arrayFormat: 'bracket' });
    },
  },
});

httpRequest.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpRequest.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default httpRequest;
