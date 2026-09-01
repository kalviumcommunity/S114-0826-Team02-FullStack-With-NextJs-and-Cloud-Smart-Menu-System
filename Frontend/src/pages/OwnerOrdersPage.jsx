import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { orderService } from '../services/orderService';

export function OwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load customer orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      loadOrders(); // Refresh order status list
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Failed to update order status');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'preparing': return 'status-preparing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Customer Orders</h1>
            <p className="page-subtitle">Track incoming food orders and update order statuses.</p>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        {loading ? (
          <div className="spinner">
            <div className="spin"></div>
            <span className="loading-text">&nbsp;Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No customer orders placed yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => {
              const dateStr = new Date(order.createdAt).toLocaleString();
              return (
                <div key={order._id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Order #{order._id.slice(-8).toUpperCase()}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({dateStr})</span>
                      <div style={{ fontSize: '0.82rem', marginTop: '0.15rem' }}>
                        Customer: <strong style={{ color: 'var(--text)' }}>{order.customer?.email || 'N/A'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                      
                      <select
                        className="form-control"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: '130px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                      {order.items.map((item, index) => (
                        <li key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.15rem 0' }}>
                          <span>
                            {item.name} <strong style={{ color: 'var(--text-muted)' }}>x {item.quantity}</strong>
                          </span>
                          <span>₹{(item.priceAtOrder * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.875rem' }}>
                      <span>Total:</span>
                      <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
export default OwnerOrdersPage;
