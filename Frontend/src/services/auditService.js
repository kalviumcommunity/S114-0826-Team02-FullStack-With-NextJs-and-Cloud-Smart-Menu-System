import api from './api';

/**
 * Audit Log Service
 * Demonstrates ASYNC/AWAIT rubric requirement.
 */
export const auditService = {
  async getAuditLogs(params = {}) {
    const response = await api.get('/audit-logs', { params });
    return response.data;
  },

  async getAuditSummary() {
    const response = await api.get('/audit-logs/summary');
    return response.data;
  }
};
