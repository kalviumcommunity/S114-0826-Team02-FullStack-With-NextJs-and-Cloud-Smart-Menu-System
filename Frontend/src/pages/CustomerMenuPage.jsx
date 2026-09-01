import React, { useState, useEffect } from 'react';
import { menuService } from '../services/menuService';
import MenuItemCard from '../components/MenuItemCard';
import CartDrawer from '../components/CartDrawer';
import Navbar from '../components/Navbar';
import { useDebounce } from '../hooks/useDebounce';
import { Search } from 'lucide-react';

export function CustomerMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  // Custom Debounce Hook usage (demonstrates closures)
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Cart State (client-side state with server-authoritative checkout)
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  // Fetch Menu Items
  const loadMenu = async () => {
    try {
      const data = await menuService.getMenuItems();
      setMenuItems(data);
      
      // Extract unique categories
      const uniqueCats = ['All', ...new Set(data.map((item) => item.category))];
      setCategories(uniqueCats);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Filter and Search processing
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart Actions
  const handleAddToCart = (item) => {
    setSuccessOrder(null);
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === item._id);
      if (existing) {
        // Enforce stock bounds
        if (existing.quantity >= item.stockQuantity) {
          alert(`Only ${item.stockQuantity} units available in stock`);
          return prevItems;
        }
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    const menuItem = menuItems.find((i) => i._id === itemId);
    if (menuItem && newQty > menuItem.stockQuantity) {
      alert(`Only ${menuItem.stockQuantity} units available in stock`);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  // Checkout Success
  const handleCheckoutSuccess = (order) => {
    setCartItems([]);
    setIsCartOpen(false);
    setSuccessOrder(order);
    loadMenu(); // Refresh stock quantities after successful order
  };

  // Checkout Conflict (409)
  const handleCheckoutConflict = () => {
    loadMenu(); // Re-fetch menu items to sync correct stock
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <Navbar onCartToggle={() => setIsCartOpen(!isCartOpen)} cartCount={cartCount} />
      <div className="container page">
        
        {/* Banner on successful order */}
        {successOrder && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            Order placed successfully! Order ID: <strong>{successOrder._id}</strong>. Status: <strong>{successOrder.status}</strong>.
          </div>
        )}

        <div className="page-header">
          <div>
            <h1 className="page-title">Browse Menu</h1>
            <p className="page-subtitle">Time-based active pricing applies dynamically to all dishes.</p>
          </div>

          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="form-control search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dishes or categories..."
              style={{ width: '260px' }}
            />
          </div>
        </div>

        {/* Filter categories */}
        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner">
            <div className="spin"></div>
            <span className="loading-text">&nbsp;Loading items...</span>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filteredMenuItems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No active dishes match your filters.
          </div>
        ) : (
          <div className="grid-cards">
            {filteredMenuItems.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
        onCheckoutConflict={handleCheckoutConflict}
      />
    </>
  );
}
export default CustomerMenuPage;
