import axios from 'axios';

const API = axios.create({ baseURL: 'https://gestao-clientes-api-jpsx.onrender.com/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getClientes = (search = '') => API.get(`/clientes?search=${search}`);
export const createCliente = (data) => API.post('/clientes', data);
export const updateCliente = (id, data) => API.put(`/clientes/${id}`, data);
export const deleteCliente = (id) => API.delete(`/clientes/${id}`);
