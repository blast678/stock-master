import api from './api';

export const ledgerService = {
  getAll: async (params) => {
    const response = await api.get('/ledger', { params });
    return response.data;
  },

  getProductHistory: async (productId) => {
    const response = await api.get(`/ledger/product/${productId}`);
    return response.data;
  }
};
