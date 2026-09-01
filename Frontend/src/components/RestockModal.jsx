import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { menuService } from '../services/menuService';

export function RestockModal({ isOpen, onClose, item, onRestockSuccess }) {
  const [quantity, setQuantity] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('add'); // 'add' or 'set'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setQuantity('');
    setAdjustmentType('add');
    setError(null);
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity === '' || Number(quantity) < 0) {
      return setError('Quantity must be a non-negative number');
    }

    setLoading(true);
    setError(null);

    try {
      await menuService.restockInventory(item._id, Number(quantity), adjustmentType);
      onRestockSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Restock: {item.name}</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Current stock: <strong>{item.stockQuantity}</strong> units.
            </p>

            <div className="form-group">
              <label className="form-label">Adjustment Mode</label>
              <select
                className="form-control"
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
              >
                <option value="add">Add to current stock</option>
                <option value="set">Set to absolute value</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={adjustmentType === 'add' ? 'e.g. 10' : 'e.g. 50'}
                min="0"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default RestockModal;
