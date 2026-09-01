import React from 'react';
import { Plus, Edit3, ShieldAlert, CalendarRange } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function MenuItemCard({
  item,
  onAddToCart,
  onEdit,
  onRestock,
  onSetPricing
}) {
  const { isOwner, isCustomer } = useAuth();
  
  const isDiscounted = item.isDiscounted;
  const isOutOfStock = item.stockQuantity === 0;
  const isLowStock = item.stockQuantity > 0 && item.stockQuantity <= 5;

  let stockClass = 'in-stock';
  let stockText = `${item.stockQuantity} available`;
  if (isOutOfStock) {
    stockClass = 'out-of-stock';
    stockText = 'Out of Stock';
  } else if (isLowStock) {
    stockClass = 'low-stock';
    stockText = `Only ${item.stockQuantity} left`;
  }

  return (
    <div className="card menu-card">
      <div className="menu-card-header">
        <h3 className="menu-card-name">{item.name}</h3>
        <span className="menu-card-category">{item.category}</span>
      </div>
      
      <p className="menu-card-desc">{item.description || 'No description provided.'}</p>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '0.5rem' }}>
        <div className="price-block">
          {isDiscounted ? (
            <>
              <span className="price-live discounted">₹{item.livePrice}</span>
              <span className="price-base">₹{item.basePrice}</span>
            </>
          ) : (
            <span className="price-live">₹{item.basePrice}</span>
          )}
        </div>
        
        <span className={`stock-badge ${stockClass}`}>
          {stockText}
        </span>
      </div>

      <div className="divider" style={{ margin: '0.75rem 0 0.5rem 0' }}></div>

      <div className="menu-card-footer">
        {isCustomer && (
          <button
            onClick={() => onAddToCart(item)}
            disabled={isOutOfStock}
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
          >
            <Plus size={14} /> Add to Cart
          </button>
        )}

        {isOwner && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.25rem', width: '100%' }}>
            <button
              onClick={() => onEdit(item)}
              className="btn btn-outline btn-sm"
              title="Edit Item"
            >
              <Edit3 size={14} /> Edit
            </button>
            <button
              onClick={() => onRestock(item)}
              className="btn btn-outline btn-sm"
              title="Restock Inventory"
            >
              <ShieldAlert size={14} /> Stock
            </button>
            <button
              onClick={() => onSetPricing(item)}
              className="btn btn-outline btn-sm"
              title="Set Pricing Schedule"
            >
              <CalendarRange size={14} /> Price
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default MenuItemCard;
