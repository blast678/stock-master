import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiList, FiGrid, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import MainLayout from '../layouts/MainLayout';
import { deliveryService } from '../services/deliveryService';
import './Delivery.css';

const STATUS_LIST = ['Draft', 'Waiting', 'Ready', 'Done', 'Cancelled'];

const Delivery = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await deliveryService.getAll();
      setDeliveries(response.data);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
      alert('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const filteredDeliveries = deliveries.filter(del =>
    del.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    del.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Kanban columns
  const kanbanGroups = STATUS_LIST.reduce((acc, status) => {
    acc[status] = filteredDeliveries.filter(d => d.status === status);
    return acc;
  }, {});

  return (
    <MainLayout>
      <div className="delivery-page">
        <div className="delivery-header-row">
          <button
            className="btn btn-primary"
            style={{ fontWeight: 600, minWidth: 86, fontSize: '1.08em' }}
            onClick={() => navigate('/delivery/new')}
          >
            <FiPlus style={{ marginRight: 6, marginBottom: -2 }} />
            NEW
          </button>
          <h1 className="delivery-title">Delivery</h1>
          <div className="delivery-header-actions">
            <div className="search-bar search-bar-compact">
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Search reference or contact..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className={`btn-icon ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
              title="List view"
              aria-label="List view"
            ><FiList /></button>
            <button
              className={`btn-icon ${view === 'kanban' ? 'active' : ''}`}
              onClick={() => setView('kanban')}
              title="Kanban view"
              aria-label="Kanban view"
            ><FiGrid /></button>
          </div>
        </div>

        {/* List View */}
        {view === 'list' && (
          <div className="delivery-table-container">
            <table className="delivery-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Contact</th>
                  <th>Schedule date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No deliveries found</td>
                  </tr>
                ) : (
                  filteredDeliveries.map(delivery => (
                    <tr
                      key={delivery._id}
                      className="delivery-row"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/delivery/${delivery._id}`)}
                    >
                      <td>
                        <span className="ref-badge">{delivery.reference}</span>
                      </td>
                      <td>{delivery.from}</td>
                      <td>{delivery.to}</td>
                      <td>{delivery.contact}</td>
                      <td>{format(new Date(delivery.scheduleDate), 'yyyy-MM-dd')}</td>
                      <td>
                        <span className={`status-badge status-${delivery.status?.toLowerCase()}`}>
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="table-help-text">Populate all delivery orders</div>
          </div>
        )}

        {/* Kanban View */}
        {view === 'kanban' && (
          <div className="kanban-board">
            {STATUS_LIST.map(status => (
              <div key={status} className="kanban-column">
                <div className={`kanban-col-header status-badge status-${status.toLowerCase()}`}>
                  {status}
                </div>
                <div className="kanban-col-content">
                  {kanbanGroups[status].length === 0 ? (
                    <div className="kanban-empty">No deliveries</div>
                  ) : (
                    kanbanGroups[status].map(delivery => (
                      <div
                        className="kanban-card"
                        key={delivery._id}
                        onClick={() => navigate(`/delivery/${delivery._id}`)}
                      >
                        <div className="kanban-ref">{delivery.reference}</div>
                        <div className="kanban-desc">{delivery.to} <span style={{color:'#999'}}>{delivery.contact}</span></div>
                        <div className="kanban-date">{format(new Date(delivery.scheduleDate), 'yyyy-MM-dd')}</div>
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

export default Delivery;
