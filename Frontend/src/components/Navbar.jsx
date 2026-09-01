import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LogOut, ClipboardList, History, FileText, Menu as MenuIcon } from 'lucide-react';

export function Navbar({ onCartToggle, cartCount = 0 }) {
  const { user, logout, isOwner, isCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          Smart Menu
        </Link>

        <div className="navbar-links">
          {isCustomer && (
            <>
              <Link
                to="/menu"
                className={`btn btn-sm ${location.pathname === '/menu' ? 'btn-outline' : 'btn-ghost'}`}
              >
                <MenuIcon size={16} /> Menu
              </Link>
              <Link
                to="/orders"
                className={`btn btn-sm ${location.pathname === '/orders' ? 'btn-outline' : 'btn-ghost'}`}
              >
                <History size={16} /> My Orders
              </Link>
            </>
          )}

          {isOwner && (
            <>
              <Link
                to="/owner/dashboard"
                className={`btn btn-sm ${location.pathname === '/owner/dashboard' ? 'btn-outline' : 'btn-ghost'}`}
              >
                <ClipboardList size={16} /> Manage Menu
              </Link>
              <Link
                to="/owner/orders"
                className={`btn btn-sm ${location.pathname === '/owner/orders' ? 'btn-outline' : 'btn-ghost'}`}
              >
                <ShoppingBag size={16} /> Orders
              </Link>
              <Link
                to="/owner/audit"
                className={`btn btn-sm ${location.pathname === '/owner/audit' ? 'btn-outline' : 'btn-ghost'}`}
              >
                <FileText size={16} /> Audit Logs
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          <span className={`role-badge ${isOwner ? 'owner' : ''}`}>
            {user.role}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-block', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </span>

          {isCustomer && (
            <button
              onClick={onCartToggle}
              className="btn btn-outline btn-sm"
              style={{ position: 'relative' }}
              aria-label="Toggle cart"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'var(--danger)',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '0.7rem',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <button onClick={handleLogoutClick} className="btn btn-ghost btn-icon" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
