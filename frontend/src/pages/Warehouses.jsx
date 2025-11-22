import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiPackage, FiMenu, FiLogOut, FiUser, FiSettings, FiTruck,
  FiEdit, FiList, FiDownload, FiUpload, FiRepeat, FiPlus,
  FiMapPin, FiTrash2, FiX, FiSearch, FiHome
} from 'react-icons/fi';
import './Warehouse.css';

const Warehouses = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [warehouses, setWarehouses] = useState([
    { _id: '1', name: 'Main Warehouse', shortCode: 'MW-001', address: '123 Industrial Area, Mumbai, Maharashtra', isActive: true },
    { _id: '2', name: 'North Storage', shortCode: 'NS-002', address: '456 North Zone, Delhi', isActive: true },
    { _id: '3', name: 'South Distribution', shortCode: 'SD-003', address: '789 South District, Chennai', isActive: false },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', shortCode: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const openAddModal = () => {
    setEditingWarehouse(null);
    setFormData({ name: '', shortCode: '', address: '' });
    setShowModal(true);
  };

  const openEditModal = (warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({ name: warehouse.name, shortCode: warehouse.shortCode, address: warehouse.address });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.shortCode || !formData.address) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (editingWarehouse) {
        setWarehouses(warehouses.map(w => w._id === editingWarehouse._id ? { ...w, ...formData } : w));
      } else {
        const newWarehouse = { _id: Date.now().toString(), ...formData, isActive: true };
        setWarehouses([...warehouses, newWarehouse]);
      }
      setShowModal(false);
      setLoading(false);
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      setWarehouses(warehouses.filter(w => w._id !== id));
    }
  };

  const toggleStatus = (id) => {
    setWarehouses(warehouses.map(w => w._id === id ? { ...w, isActive: !w.isActive } : w));
  };

  const filteredWarehouses = warehouses.filter(w =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <FiPackage size={32} />
          {sidebarOpen && <h2>StockMaster</h2>}
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/dashboard')}>
            <FiList /> {sidebarOpen && <span>Dashboard</span>}
          </button>
          <button className="nav-item" onClick={() => navigate('/products')}>
            <FiPackage /> {sidebarOpen && <span>Products</span>}
          </button>
          <div className="nav-section">
            {sidebarOpen && <h4>Operations</h4>}
            <button className="nav-item" onClick={() => navigate('/receipts')}>
              <FiDownload /> {sidebarOpen && <span>Receipts</span>}
            </button>
            <button className="nav-item" onClick={() => navigate('/delivery')}>
              <FiUpload /> {sidebarOpen && <span>Delivery</span>}
            </button>
            <button className="nav-item" onClick={() => navigate('/transfer')}>
              <FiRepeat /> {sidebarOpen && <span>Internal Transfer</span>}
            </button>
            <button className="nav-item" onClick={() => navigate('/adjustment')}>
              <FiEdit /> {sidebarOpen && <span>Adjustment</span>}
            </button>
          </div>
          <button className="nav-item" onClick={() => navigate('/history')}>
            <FiTruck /> {sidebarOpen && <span>Move History</span>}
          </button>
          <button className="nav-item active" onClick={() => navigate('/warehouses')}>
            <FiHome /> {sidebarOpen && <span>Warehouses</span>}
          </button>
          <button className="nav-item" onClick={() => navigate('/settings')}>
            <FiSettings /> {sidebarOpen && <span>Settings</span>}
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => navigate('/profile')}>
            <FiUser /> {sidebarOpen && <span>Profile</span>}
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            <FiLogOut /> {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu />
            </button>
            <h1>Warehouses</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.loginId || 'Admin'}</span>
              <span className="user-role">{user?.role || 'Manager'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <section className="warehouse-section">
          <div className="section-toolbar">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              <FiPlus /> Add Warehouse
            </button>
          </div>

          <div className="warehouse-grid">
            {filteredWarehouses.length === 0 ? (
              <div className="no-data">
                <FiMapPin size={48} />
                <p>No warehouses found</p>
              </div>
            ) : (
              filteredWarehouses.map((warehouse) => (
                <div key={warehouse._id} className={`warehouse-card ${!warehouse.isActive ? 'inactive' : ''}`}>
                  <div className="warehouse-card-header">
                    <div className="warehouse-icon">
                      <FiHome />
                    </div>
                    <div className="warehouse-status">
                      <span className={`status-badge ${warehouse.isActive ? 'active' : 'inactive'}`}>
                        {warehouse.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="warehouse-card-body">
                    <h3>{warehouse.name}</h3>
                    <p className="short-code">{warehouse.shortCode}</p>
                    <p className="address"><FiMapPin /> {warehouse.address}</p>
                  </div>
                  <div className="warehouse-card-actions">
                    <button className="btn-icon edit" onClick={() => openEditModal(warehouse)} title="Edit">
                      <FiEdit />
                    </button>
                    <button className="btn-icon toggle" onClick={() => toggleStatus(warehouse._id)} title={warehouse.isActive ? 'Deactivate' : 'Activate'}>
                      {warehouse.isActive ? '🔒' : '🔓'}
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(warehouse._id)} title="Delete">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>
            <form className="warehouse-form" onSubmit={handleSubmit}>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter warehouse name"
                  value={formData.name}
                  onChange={handleChange}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="shortCode">Short Code</label>
                <input
                  type="text"
                  id="shortCode"
                  name="shortCode"
                  placeholder="e.g., MW-001"
                  value={formData.shortCode}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingWarehouse ? 'Update' : 'Add Warehouse')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouses;