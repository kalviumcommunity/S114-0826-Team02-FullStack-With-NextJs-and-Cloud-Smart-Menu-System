import React, { useState } from 'react';
import { X, ShoppingBag, AlertCircle } from 'lucide-react';
import { orderService } from '../services/orderService';

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckoutSuccess,
  onCheckoutConflict // Callback to trigger menu reload after a 409 conflict
}) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.livePrice * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setErrorBanner(null);

    const orderPayload = cartItems.map((item) => ({
      menuItemId: item._id,
      quantity: item.quantity
    }));

    try {
      const order = await orderService.createOrder(orderPayload);
      onCheckoutSuccess(order);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Concurrency-safe HTTP 409 Conflict handling UI banner
        setErrorBanner(
          "Oops! Another customer just purchased the last unit of this item. Your cart was updated."
        );
        if (onCheckoutConflict) {
          onCheckoutConflict();
        }
      } else {
        setErrorBanner(err.response?.data?.error || err.message || 'Checkout failed');
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-drawer">
        <div className="cart-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={18} /> Shopping Cart
          </h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        <div className="cart-body">
          {errorBanner && (
            <div className="alert alert-error" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorBanner}</div>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              Your cart is empty. Add dishes from the menu to get started.
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    ₹{item.livePrice} x {item.quantity}
                  </div>
                </div>

                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQty(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-val">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQty(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn-icon"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => onRemoveItem(item._id)}
                  title="Remove Item"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total Amount:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {checkoutLoading ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
export default CartDrawer;
