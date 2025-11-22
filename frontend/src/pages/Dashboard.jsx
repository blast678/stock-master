import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import {
  FiPackage,
  FiAlertTriangle,
  FiXCircle,
  FiDownload,
  FiUpload,
  FiRepeat,
  FiMenu,
  FiLogOut,
  FiUser,
  FiSettings,
  FiTruck,
  FiEdit,
  FiList
} from 'react-icons/fi';

import KPICard from '../components/dashboard/KPICard';
import FilterPanel from '../components/dashboard/FilterPanel';
import RecentActivities from '../components/dashboard/RecentActivities';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [kpis, setKpis] = useState(null);
  const [activities, setActivities] = useState([]);
  const [operations, setOperations] = useState({ receipts: {}, deliveries: {} });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [kpisData, activitiesData, operationsData] = await Promise.all([
        dashboardService.getKPIs(),
        dashboardService.getRecentActivities(10),
        dashboardService.getOperations()
      ]);

      setKpis(kpisData.data || {
        totalProducts: 0,
        totalReceipts: 0,
        totalDeliveries: 0,
        totalStockValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        pendingReceipts: 0,
        pendingDeliveries: 0,
        internalTransfers: 0
      });

      setActivities(activitiesData.data || []);
      
      setOperations(operationsData.data || {
        receipts: { draft: 0, ready: 0, done: 0 },
        deliveries: { draft: 0, waiting: 0, ready: 0, done: 0 }
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set default values on error
      setKpis({
        totalProducts: 0,
        totalReceipts: 0,
        totalDeliveries: 0,
        totalStockValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        pendingReceipts: 0,
        pendingDeliveries: 0,
        internalTransfers: 0
      });
      setActivities([]);
      setOperations({
        receipts: { draft: 0, ready: 0, done: 0 },
        deliveries: { draft: 0, waiting: 0, ready: 0, done: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (filters) => {
    try {
      const operationsData = await dashboardService.getOperations(filters);
      setOperations(operationsData.data || {
        receipts: { draft: 0, ready: 0, done: 0 },
        deliveries: { draft: 0, waiting: 0, ready: 0, done: 0 }
      });
    } catch (error) {
      console.error('Failed to filter operations:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <FiPackage size={32} />
          {sidebarOpen && <h2>StockMaster</h2>}
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active" onClick={() => navigate('/dashboard')}>
            <FiList />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button className="nav-item" onClick={() => navigate('/products')}>
            <FiPackage />
            {sidebarOpen && <span>Products</span>}
          </button>

          <div className="nav-section">
            {sidebarOpen && <h4>Operations</h4>}
            <button className="nav-item" onClick={() => navigate('/receipts')}>
              <FiDownload />
              {sidebarOpen && <span>Receipts</span>}
            </button>
            <button className="nav-item" onClick={() => navigate('/delivery')}>
              <FiUpload />
              {sidebarOpen && <span>Delivery</span>}
            </button>
            <button className="nav-item" onClick={() => navigate('/transfer')}>
              <FiRepeat />
              {sidebarOpen && <span>Internal Transfer</span>}
            </button>
            <button className="nav-item" onClick={() => navigate('/adjustment')}>
              <FiEdit />
              {sidebarOpen && <span>Adjustment</span>}
            </button>
          </div>

          <button className="nav-item" onClick={() => navigate('/history')}>
            <FiTruck />
            {sidebarOpen && <span>Move History</span>}
          </button>

          <button className="nav-item" onClick={() => navigate('/settings')}>
            <FiSettings />
            {sidebarOpen && <span>Settings</span>}
          </button>
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

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu />
            </button>
            <h1>Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.loginId}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
        </header>

        {/* KPIs Section */}
        <section className="kpis-section">
          <div className="kpis-grid">
            <KPICard
              title="Total Products"
              value={kpis?.totalProducts || 0}
              icon={FiPackage}
              color="blue"
              onClick={() => navigate('/products')}
            />
            <KPICard
              title="Low Stock Items"
              value={kpis?.lowStockItems || 0}
              icon={FiAlertTriangle}
              color="orange"
              onClick={() => navigate('/products?filter=low-stock')}
            />
            <KPICard
              title="Out of Stock"
              value={kpis?.outOfStockItems || 0}
              icon={FiXCircle}
              color="red"
              onClick={() => navigate('/products?filter=out-of-stock')}
            />
            <KPICard
              title="Pending Receipts"
              value={kpis?.pendingReceipts || 0}
              icon={FiDownload}
              color="green"
              onClick={() => navigate('/receipts')}
            />
            <KPICard
              title="Pending Deliveries"
              value={kpis?.pendingDeliveries || 0}
              icon={FiUpload}
              color="purple"
              onClick={() => navigate('/delivery')}
            />
            <KPICard
              title="Internal Transfers"
              value={kpis?.internalTransfers || 0}
              icon={FiRepeat}
              color="teal"
              onClick={() => navigate('/transfer')}
            />
          </div>
        </section>

        {/* Operations Summary */}
        <section className="operations-section">
          <div className="section-header">
            <h2>Operations Summary</h2>
            <FilterPanel
              onFilterChange={handleFilterChange}
              warehouses={[]}
              categories={[]}
            />
          </div>

          <div className="operations-cards">
            <div className="operation-card receipt-card">
              <div className="card-header">
                <h3>Receipt</h3>
                <div className="card-badge">
                  <span className="badge late">
                    {operations?.receipts?.draft || 0} Draft
                  </span>
                </div>
              </div>
              <div className="card-body">
                <button className="btn-card" onClick={() => navigate('/receipts')}>
                  {(operations?.receipts?.ready || 0)} to receive
                </button>
                <div className="card-stats">
                  <p>Draft: {operations?.receipts?.draft || 0}</p>
                  <p>Ready: {operations?.receipts?.ready || 0}</p>
                  <p>Done: {operations?.receipts?.done || 0}</p>
                </div>
              </div>
            </div>

            <div className="operation-card delivery-card">
              <div className="card-header">
                <h3>Delivery</h3>
                <div className="card-badge">
                  <span className="badge waiting">
                    {operations?.deliveries?.waiting || 0} Waiting
                  </span>
                </div>
              </div>
              <div className="card-body">
                <button className="btn-card" onClick={() => navigate('/delivery')}>
                  {(operations?.deliveries?.ready || 0) + (operations?.deliveries?.waiting || 0)} to Deliver
                </button>
                <div className="card-stats">
                  <p>Draft: {operations?.deliveries?.draft || 0}</p>
                  <p>Waiting: {operations?.deliveries?.waiting || 0}</p>
                  <p>Ready: {operations?.deliveries?.ready || 0}</p>
                  <p>Done: {operations?.deliveries?.done || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activities */}
        <section className="activities-section">
          <RecentActivities activities={activities} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;