import api from './api';

export const deliveryService = {
  getAll: async () => {
    const response = await api.get('/delivery');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/delivery/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/delivery', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/delivery/${id}`, data);
    return response.data;
  },

  validate: async (id) => {
    const response = await api.post(`/delivery/${id}/validate`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/delivery/${id}`);
    return response.data;
  }
};
