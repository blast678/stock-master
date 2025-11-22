import api from './api';

export const dashboardService = {
  // Get KPIs
  getKPIs: async () => {
    const response = await api.get('/dashboard/kpis');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    const response = await api.get(`/dashboard/activities?limit=${limit}`);
    return response.data;
  },

  // Get operations summary with filters
  getOperations: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/dashboard/operations?${params}`);
    return response.data;
  },

  // Get stock statistics
  getStockStats: async () => {
    const response = await api.get('/dashboard/stock-stats');
    return response.data;
  }
};
