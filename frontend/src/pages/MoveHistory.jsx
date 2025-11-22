import { useState, useEffect } from 'react';
import { FiPlus, FiList, FiGrid, FiSearch, FiTruck } from 'react-icons/fi';
import { format } from 'date-fns';
import MainLayout from '../layouts/MainLayout';
import { ledgerService } from '../services/ledgerService';
import './MoveHistory.css';

const MoveHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    operationType: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        operationType: filter.operationType,
        startDate: filter.startDate,
        endDate: filter.endDate
      };
      const response = await ledgerService.getAll(params);

      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      alert('Failed to load move history');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchHistory();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredHistory = history.filter(item =>
    item.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="history-page">
        <div className="history-header-row">
          <button className="btn btn-primary" style={{ fontWeight: 600, minWidth: 86, fontSize: '1.08em' }}>
            <FiPlus style={{ marginRight: 6, marginBottom: -2 }} />
            NEW
          </button>
          <h1 className="history-title">Move History</h1>
          <div className="history-header-actions">
            <div className="search-bar search-bar-compact">
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Search reference or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              className={`btn-icon ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
              title="List view"
            ><FiList /></button>
            <button
              className={`btn-icon ${view === 'kanban' ? 'active' : ''}`}
              onClick={() => setView('kanban')}
              title="Kanban view"
            ><FiGrid /></button>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <div className="filter-group">
            <label>Type</label>
            <select name="operationType" value={filter.operationType} onChange={handleFilterChange}>
              <option value="all">All Types</option>
              <option value="receipt">Receipt (IN)</option>
              <option value="delivery">Delivery (OUT)</option>
              <option value="transfer">Transfer</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value={filter.startDate} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <label>End Date</label>
            <input type="date" name="endDate" value={filter.endDate} onChange={handleFilterChange} />
          </div>
        </div>

        {/* List View */}
        {view === 'list' && (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Contact</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">No move history found</td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => (
                    <tr key={item._id} className={`history-row ${item.operationType === 'receipt' ? 'row-in' : 'row-out'}`}>
                      <td>
                        <span className="ref-badge">{item.reference}</span>
                      </td>
                      <td>{format(new Date(item.createdAt), 'yyyy-MM-dd')}</td>
                      <td>{item.contact || '-'}</td>
                      <td>{item.from}</td>
                      <td>{item.to}</td>
                      <td>
                        <span className={item.operationType === 'receipt' ? 'qty-in' : 'qty-out'}>
                          {item.productName} ({item.quantity})
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Kanban View */}
        {view === 'kanban' && (
          <div className="kanban-board">
            {['receipt', 'delivery', 'transfer', 'adjustment'].map(type => (
              <div key={type} className="kanban-column">
                <div className={`kanban-col-header type-badge type-${type}`}>
                  {type.toUpperCase()}
                </div>
                <div className="kanban-col-content">
                  {filteredHistory.filter(h => h.operationType === type).length === 0 ? (
                    <div className="kanban-empty">No moves</div>
                  ) : (
                    filteredHistory.filter(h => h.operationType === type).map(item => (
                      <div className="kanban-card" key={item._id}>
                        <div className="kanban-ref">{item.reference}</div>
                        <div className="kanban-desc">{item.from} → {item.to}</div>
                        <div className="kanban-product">{item.productName} ({item.quantity})</div>
                        <div className="kanban-date">{format(new Date(item.createdAt), 'MMM dd, yyyy')}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MoveHistory;