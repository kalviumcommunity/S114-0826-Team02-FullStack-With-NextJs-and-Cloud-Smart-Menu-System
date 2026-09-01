import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { orderService } from '../services/orderService';
import { useOrderPolling } from '../hooks/useOrderPolling';
import { ChevronDown, ChevronUp } from 'lucide-react';

function OrderRow({ initialOrder }) {
  const [expanded, setExpanded] = useState(false);
  
  // Use our custom polling hook to automatically query database status updates non-blockingly
  const { order } = useOrderPolling(initialOrder._id);
  const currentOrder = order || initialOrder;

  const dateStr = new Date(currentOrder.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      <tr onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <td style={{ fontWeight: 600 }}>#{currentOrder._id.slice(-6)}</td>
        <td>{dateStr}</td>
        <td>
          <span className={`status-badge status-${currentOrder.status}`}>
            {currentOrder.status}
          </span>
        </td>
        <td style={{ fontWeight: 600 }}>₹{currentOrder.totalAmount.toFixed(2)}</td>
        <td>
          <button className="btn btn-ghost btn-sm" style={{ padding: '0.2rem' }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan="5" style={{ background: '#f8fafc', padding: '1rem' }}>
            <div style={{ fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Order Items:
              </div>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {currentOrder.items.map((item, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span>
                      {item.name} <strong>x {item.quantity}</strong>
                    </span>
                    <span>₹{(item.priceAtOrder * item.quantity).toFixed(2)} (₹{item.priceAtOrder} each)</span>
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Order History</h1>
            <p className="page-subtitle">Your orders are polled automatically in the background until prepared.</p>
          </div>
        </div>

        {loading ? (
          <div className="spinner">
            <div className="spin"></div>
            <span className="loading-text">&nbsp;Loading order history...</span>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            You have not placed any orders yet.
          </div>
        ) : (
          <div className="card table-wrap" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderRow key={order._id} initialOrder={order} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
export default OrderHistoryPage;
