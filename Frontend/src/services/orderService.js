import api from './api';

/**
 * Order Service
 * Demonstrates ASYNC/AWAIT rubric requirement.
 */
export const orderService = {
  async createOrder(items) {
    // items shape: [{ menuItemId, quantity }]
    const response = await api.post('/orders', { items });
    return response.data;
  },

  async getOrders() {
    const response = await api.get('/orders');
    return response.data;
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  }
};
