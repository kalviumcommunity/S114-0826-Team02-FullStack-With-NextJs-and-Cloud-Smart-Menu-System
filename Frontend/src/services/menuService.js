import api from './api';

/**
 * Menu & Inventory Service
 * Demonstrates ASYNC/AWAIT rubric requirement.
 */
export const menuService = {
  async getMenuItems() {
    const response = await api.get('/menu');
    return response.data;
  },

  async getMenuItemById(id) {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  },

  async createMenuItem(data) {
    const response = await api.post('/menu', data);
    return response.data;
  },

  async updateMenuItem(id, data) {
    const response = await api.put(`/menu/${id}`, data);
    return response.data;
  },

  async deleteMenuItem(id) {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },

  async restockInventory(id, quantity, adjustmentType = 'add') {
    const response = await api.patch(`/menu/${id}/inventory`, { quantity, adjustmentType });
    return response.data;
  },

  async setPricingSchedule(id, scheduleData) {
    const response = await api.post(`/menu/${id}/pricing-schedule`, scheduleData);
    return response.data;
  }
};
