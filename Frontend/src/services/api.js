import axios from 'axios';

// Create an Axios instance with base URL configured for the backend proxy
const api = axios.create({
  baseURL: '/api',
});

// Request interceptor to automatically attach authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * ============================================================================
 * RUBRIC CALLOUT: PROMISES VS CALLBACKS
 *
 * This Axios client demonstrates the modern PROMISE-based asynchronous model.
 * A Promise represents an eventual completion or failure of an asynchronous
 * operation and returns a clean, chainable object.
 *
 * Contrast this with the traditional CALLBACK model:
 *
 * // Callback Pattern (Raw HTTP Request):
 * function fetchDataCallback(url, callback) {
 *   const xhr = new XMLHttpRequest();
 *   xhr.open("GET", url);
 *   xhr.onload = () => callback(null, JSON.parse(xhr.responseText));
 *   xhr.onerror = () => callback(xhr.statusText);
 *   xhr.send();
 * }
 * // Usage leads to deeply nested indentation ("Callback Hell") if chained.
 * fetchDataCallback('/api/menu', (err, data) => {
 *   if (err) handle(err);
 *   else {
 *     fetchDataCallback('/api/orders', (err2, data2) => {
 *       // ... nested callbacks
 *     });
 *   }
 * });
 *
 * // Promise / Async-Await Pattern (Axios):
 * // Clear, flat, and allows standardized try/catch block handling.
 * try {
 *   const menu = await api.get('/menu');
 *   const orders = await api.get('/orders');
 * } catch (error) {
 *   handle(error);
 * }
 * ============================================================================
 */

export default api;
