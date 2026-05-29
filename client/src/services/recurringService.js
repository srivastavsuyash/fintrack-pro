import api from './api.js';

export const getRecurring = async () => {
  const res = await api.get('/recurring');
  return res.data;
};

export const createRecurring = async (data) => {
  const res = await api.post('/recurring', data);
  return res.data;
};

export const updateRecurring = async (id, data) => {
  const res = await api.put(`/recurring/${id}`, data);
  return res.data;
};

export const deleteRecurring = async (id) => {
  const res = await api.delete(`/recurring/${id}`);
  return res.data;
};