import api from './api';

export const warehouseService = {
  // Get all warehouses
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/warehouses?${queryString}`);
    return response.data;
  },

  // Get single warehouse by ID
  getById: async (id) => {
    const response = await api.get(`/warehouses/${id}`);
    return response.data;
  },

  // Create new warehouse
  create: async (data) => {
    const response = await api.post('/warehouses', data);
    return response.data;
  },

  // Update warehouse
  update: async (id, data) => {
    const response = await api.put(`/warehouses/${id}`, data);
    return response.data;
  },

  // Delete warehouse
  delete: async (id) => {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data;
  },

  // Toggle warehouse status (active/inactive)
  toggleStatus: async (id) => {
    const response = await api.patch(`/warehouses/${id}/toggle-status`);
    return response.data;
  },

  // Get warehouse stock summary
  getStockSummary: async (id) => {
    const response = await api.get(`/warehouses/${id}/stock-summary`);
    return response.data;
  }
};