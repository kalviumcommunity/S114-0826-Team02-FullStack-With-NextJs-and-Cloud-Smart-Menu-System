import api from './api';

/**
 * Auth Service
 * Demonstrates ASYNC/AWAIT rubric requirement.
 */
export const authService = {
  async signup(username, email, password) {
    const response = await api.post('/auth/signup', { username, email, password });
    return response.data; // returns { token, user: { id, username, email, role } }
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // returns { token, user: { id, username, email, role } }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data; // returns { user: { id, username, email, role } }
  }
};
