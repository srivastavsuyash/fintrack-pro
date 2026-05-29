import api from './api.js';

export const getTransactions = async (params) => {
  const res = await api.get('/transactions', { params });
  return res.data;
};

export const createTransaction = async (data) => {
  const res = await api.post('/transactions', data);
  return res.data;
};

export const updateTransaction = async (id, data) => {
  const res = await api.put(`/transactions/${id}`, data);
  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await api.delete(`/transactions/${id}`);
  return res.data;
};

export const getSummary = async () => {
  const res = await api.get('/transactions/summary');
  return res.data;
};