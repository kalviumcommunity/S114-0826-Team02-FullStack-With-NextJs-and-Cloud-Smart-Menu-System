import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { menuService } from '../services/menuService';
import MenuModal from '../components/MenuModal';
import RestockModal from '../components/RestockModal';
import PricingModal from '../components/PricingModal';
import { Plus, Edit2, ShieldAlert, CalendarRange, Trash2 } from 'lucide-react';

export function OwnerDashboardPage() {
  const [menuItems, setMenuItems] = useState([]);
  
  // Modals state
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedRestockItem, setSelectedRestockItem] = useState(null);
  
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [selectedPricingItem, setSelectedPricingItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMenu = async () => {
    try {
      // Owner fetches all menu items (including inactive)
      const data = await menuService.getMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleEditClick = (item) => {
    setSelectedEditItem(item);
    setIsMenuModalOpen(true);
  };

  const handleRestockClick = (item) => {
    setSelectedRestockItem(item);
    setIsRestockModalOpen(true);
  };

  const handlePricingClick = (item) => {
    setSelectedPricingItem(item);
    setIsPricingModalOpen(true);
  };

  const handleDeactivate = async (itemId) => {
    if (window.confirm('Are you sure you want to deactivate this menu item?')) {
      try {
        await menuService.deleteMenuItem(itemId);
        loadMenu();
      } catch (err) {
        alert(err.response?.data?.error || err.message || 'Failed to deactivate menu item');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Menu Management</h1>
            <p className="page-subtitle">Configure dishes, pricing schedules, and restock restaurant inventory.</p>
          </div>
          <button
            onClick={() => {
              setSelectedEditItem(null);
              setIsMenuModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        {loading ? (
          <div className="spinner">
            <div className="spin"></div>
            <span className="loading-text">&nbsp;Loading menu items...</span>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No menu items found. Click 'Add Item' to create one.
          </div>
        ) : (
          <div className="card table-wrap" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Dish Name</th>
                  <th>Category</th>
                  <th>Base Price</th>
                  <th>Live Price</th>
                  <th>Stock Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td>{item.category}</td>
                    <td>₹{item.basePrice.toFixed(2)}</td>
                    <td style={{ color: item.isDiscounted ? 'var(--success)' : 'inherit', fontWeight: item.isDiscounted ? 600 : 'normal' }}>
                      ₹{item.livePrice.toFixed(2)}
                      {item.isDiscounted && <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-muted)', fontWeight: 'normal' }}>({item.appliedSchedule?.title})</span>}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: item.stockQuantity === 0 ? 'var(--danger)' : 'inherit' }}>
                        {item.stockQuantity}
                      </span>
                    </td>
                    <td>
                      <span className={`role-badge ${item.isActive ? '' : 'owner'}`} style={{ textTransform: 'capitalize' }}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="btn btn-outline btn-sm"
                          title="Edit details"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleRestockClick(item)}
                          className="btn btn-outline btn-sm"
                          title="Restock inventory"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <ShieldAlert size={12} /> Stock
                        </button>
                        <button
                          onClick={() => handlePricingClick(item)}
                          className="btn btn-outline btn-sm"
                          title="Pricing schedule"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <CalendarRange size={12} /> Price
                        </button>
                        {item.isActive && (
                          <button
                            onClick={() => handleDeactivate(item._id)}
                            className="btn btn-danger-outline btn-sm"
                            title="Deactivate item"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <Trash2 size={12} /> Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        editItem={selectedEditItem}
        onSaveSuccess={loadMenu}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        item={selectedRestockItem}
        onRestockSuccess={loadMenu}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        item={selectedPricingItem}
        onPricingSuccess={loadMenu}
      />
    </>
  );
}
export default OwnerDashboardPage;
