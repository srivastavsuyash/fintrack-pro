import api from './api.js';

export const getSavingsGoals = async () => {
  const res = await api.get('/savings');
  return res.data;
};

export const createSavingsGoal = async (data) => {
  const res = await api.post('/savings', data);
  return res.data;
};

export const updateSavingsGoal = async (id, data) => {
  const res = await api.put(`/savings/${id}`, data);
  return res.data;
};

export const deleteSavingsGoal = async (id) => {
  const res = await api.delete(`/savings/${id}`);
  return res.data;
};