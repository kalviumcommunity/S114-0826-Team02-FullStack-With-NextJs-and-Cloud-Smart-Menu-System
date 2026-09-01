import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { menuService } from '../services/menuService';

export function MenuModal({ isOpen, onClose, editItem, onSaveSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [basePrice, setBasePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editItem) {
      setName(editItem.name || '');
      setDescription(editItem.description || '');
      setCategory(editItem.category || 'Main Course');
      setBasePrice(editItem.basePrice || '');
      setStockQuantity(editItem.stockQuantity || '');
      setIsActive(editItem.isActive !== false);
    } else {
      setName('');
      setDescription('');
      setCategory('Main Course');
      setBasePrice('');
      setStockQuantity('');
      setIsActive(true);
    }
    setError(null);
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Dish name is required');
    if (basePrice === '' || Number(basePrice) < 0) return setError('Base price must be a non-negative number');
    if (!editItem && (stockQuantity === '' || Number(stockQuantity) < 0)) return setError('Stock quantity must be a non-negative number');

    setLoading(true);
    setError(null);

    const payload = {
      name,
      description,
      category,
      basePrice: Number(basePrice),
      isActive
    };

    if (!editItem) {
      payload.stockQuantity = Number(stockQuantity);
    }

    try {
      if (editItem) {
        await menuService.updateMenuItem(editItem._id, payload);
      } else {
        await menuService.createMenuItem(payload);
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{editItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            <div className="form-group">
              <label className="form-label">Dish Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Paneer Butter Masala"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Starter">Starter</option>
                <option value="Main Course">Main Course</option>
                <option value="Bread">Bread</option>
                <option value="Beverage">Beverage</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the dish"
                rows={3}
              />
            </div>

            <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '0.25rem' }}>
              <div className="form-group">
                <label className="form-label">Base Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="250"
                  min="0"
                />
              </div>

              {!editItem && (
                <div className="form-group">
                  <label className="form-label">Initial Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="20"
                    min="0"
                  />
                </div>
              )}
            </div>

            <div className="form-group" style={{ flexDirection: 'row', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label htmlFor="isActive" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                Active (available on customer menu)
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default MenuModal;
