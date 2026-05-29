import api from './api.js';

export const getAIInsights = async () => {
  const res = await api.get('/ai/insights');
  return res.data;
};