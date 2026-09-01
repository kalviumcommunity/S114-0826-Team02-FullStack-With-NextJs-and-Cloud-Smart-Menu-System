import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { menuService } from '../services/menuService';

export function PricingModal({ isOpen, onClose, item, onPricingSuccess }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('15:00');
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  
  const [pricingType, setPricingType] = useState('multiplier'); // 'multiplier' or 'override'
  const [priceMultiplier, setPriceMultiplier] = useState('');
  const [overridePrice, setOverridePrice] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle('Happy Hour / Special Pricing');
    setStartTime('11:00');
    setEndTime('15:00');
    setDaysOfWeek([]);
    setPricingType('multiplier');
    setPriceMultiplier('');
    setOverridePrice('');
    setError(null);
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleDayToggle = (dayIndex) => {
    setDaysOfWeek((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('Schedule title is required');
    if (!startTime || !endTime) return setError('Start and end times are required');

    const scheduleData = {
      title,
      startTime,
      endTime,
      daysOfWeek,
      isActive: true
    };

    if (pricingType === 'multiplier') {
      if (priceMultiplier === '' || Number(priceMultiplier) <= 0) {
        return setError('Multiplier must be a positive number');
      }
      scheduleData.priceMultiplier = Number(priceMultiplier);
      scheduleData.overridePrice = null;
    } else {
      if (overridePrice === '' || Number(overridePrice) < 0) {
        return setError('Override price must be a non-negative number');
      }
      scheduleData.overridePrice = Number(overridePrice);
      scheduleData.priceMultiplier = null;
    }

    setLoading(true);
    setError(null);

    try {
      await menuService.setPricingSchedule(item._id, scheduleData);
      onPricingSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update schedule');
    } finally {
      setLoading(false);
    }
  };

  const daysLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Configure Pricing: {item.name}</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Base Price: <strong>₹{item.basePrice}</strong>. Define a time window to dynamically modify this price.
            </p>

            <div className="form-group">
              <label className="form-label">Schedule Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lunch Special, Happy Hour"
              />
            </div>

            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Start Time (HH:mm)</label>
                <input
                  type="text"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="11:30"
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time (HH:mm)</label>
                <input
                  type="text"
                  className="form-control"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="14:30"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Days of Week (Optional - Empty means every day)</label>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {daysLabel.map((day, idx) => {
                  const isChecked = daysOfWeek.includes(idx);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(idx)}
                      className={`btn btn-sm ${isChecked ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', minWidth: '40px' }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="divider" style={{ margin: '1rem 0' }}></div>

            <div className="form-group">
              <label className="form-label">Pricing Type</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="pricingType"
                    checked={pricingType === 'multiplier'}
                    onChange={() => setPricingType('multiplier')}
                  />
                  Price Multiplier
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="pricingType"
                    checked={pricingType === 'override'}
                    onChange={() => setPricingType('override')}
                  />
                  Fixed Price Override
                </label>
              </div>
            </div>

            {pricingType === 'multiplier' ? (
              <div className="form-group">
                <label className="form-label">Multiplier</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={priceMultiplier}
                  onChange={(e) => setPriceMultiplier(e.target.value)}
                  placeholder="e.g. 0.80 for 20% off, 1.20 for surge"
                />
                <span className="form-hint">
                  Calculated price: ₹{(Number(priceMultiplier || 1) * item.basePrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Override Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={overridePrice}
                  onChange={(e) => setOverridePrice(e.target.value)}
                  placeholder="e.g. 199"
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Apply Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default PricingModal;
