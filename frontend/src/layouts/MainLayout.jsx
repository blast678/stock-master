import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMenu,
  FiPackage,
  FiDownload,
  FiUpload,
  FiRepeat,
  FiEdit,
  FiTruck,
  FiSettings,
  FiUser,
  FiLogOut,
  FiList
} from 'react-icons/fi';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/dashboard', icon: FiList, label: 'Dashboard' },
    { path: '/products', icon: FiPackage, label: 'Products' },
    { path: '/receipts', icon: FiDownload, label: 'Receipts' },
    { path: '/delivery', icon: FiUpload, label: 'Delivery' },
    { path: '/transfer', icon: FiRepeat, label: 'Transfer' },
    { path: '/adjustment', icon: FiEdit, label: 'Adjustment' },
    { path: '/history', icon: FiTruck, label: 'Move History' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <FiPackage size={32} />
          {sidebarOpen && <h2>StockMaster</h2>}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => navigate('/profile')}>
            <FiUser />
            {sidebarOpen && <span>Profile</span>}
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            <FiLogOut />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu />
          </button>
          <div className="user-info">
            <span className="user-name">{user?.loginId}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </header>

        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
