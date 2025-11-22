import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEye, FiUpload } from 'react-icons/fi';
import { format } from 'date-fns';
import MainLayout from '../layouts/MainLayout';
import './Delivery.css';

const Delivery = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      // TODO: API call
      // Mock data
      setDeliveries([
        { _id: '1', deliveryNo: 'WH/OUT/0001', customer: 'Client ABC', scheduleDate: new Date(), status: 'done', totalItems: 4 },
        { _id: '2', deliveryNo: 'WH/OUT/0002', customer: 'Customer XYZ', scheduleDate: new Date(), status: 'ready', totalItems: 6 },
        { _id: '3', deliveryNo: 'WH/OUT/0003', customer: 'Retail Store', scheduleDate: new Date(), status: 'waiting', totalItems: 3 },
      ]);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    }
  };

  const filteredDeliveries = filter === 'all' 
    ? deliveries 
    : deliveries.filter(d => d.status === filter);

  return (
    <MainLayout>
      <div className="delivery-page">
        <div className="page-header">
          <div className="header-left">
            <FiUpload size={32} />
            <h1>Delivery (Outgoing Stock)</h1>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/delivery/new')}>
            <FiPlus /> New Delivery
          </button>
        </div>

        <div className="filter-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            All
          </button>
          <button className={filter === 'draft' ? 'active' : ''} onClick={() => setFilter('draft')}>
            Draft
          </button>
          <button className={filter === 'waiting' ? 'active' : ''} onClick={() => setFilter('waiting')}>
            Waiting
          </button>
          <button className={filter === 'ready' ? 'active' : ''} onClick={() => setFilter('ready')}>
            Ready
          </button>
          <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>
            Done
          </button>
        </div>

        <div className="delivery-grid">
          {filteredDeliveries.map(delivery => (
            <div key={delivery._id} className="delivery-card">
              <div className="card-header">
                <h3>{delivery.deliveryNo}</h3>
                <span className={`status-badge status-${delivery.status}`}>
                  {delivery.status}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Customer:</strong> {delivery.customer}</p>
                <p><strong>Schedule:</strong> {format(new Date(delivery.scheduleDate), 'MMM dd, yyyy')}</p>
                <p><strong>Items:</strong> {delivery.totalItems}</p>
              </div>
              <div className="card-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/delivery/${delivery._id}`)}>
                  <FiEye /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Delivery;
