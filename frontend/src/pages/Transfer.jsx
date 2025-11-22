import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEye, FiRepeat } from 'react-icons/fi';
import { format } from 'date-fns';
import MainLayout from '../layouts/MainLayout';
import './Transfer.css';

const Transfer = () => {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      // Mock data
      setTransfers([
        { _id: '1', transferNo: 'WH/TRF/0001', fromWarehouse: 'Main Warehouse', toWarehouse: 'Branch Store', scheduleDate: new Date(), status: 'done', totalItems: 2 },
        { _id: '2', transferNo: 'WH/TRF/0002', fromWarehouse: 'Branch Store', toWarehouse: 'Retail Outlet', scheduleDate: new Date(), status: 'ready', totalItems: 4 },
        { _id: '3', transferNo: 'WH/TRF/0003', fromWarehouse: 'Main Warehouse', toWarehouse: 'Warehouse 2', scheduleDate: new Date(), status: 'waiting', totalItems: 3 },
      ]);
    } catch (error) {
      console.error('Failed to fetch transfers:', error);
    }
  };

  const filteredTransfers = filter === 'all' 
    ? transfers 
    : transfers.filter(t => t.status === filter);

  return (
    <MainLayout>
      <div className="transfer-page">
        <div className="page-header">
          <div className="header-left">
            <FiRepeat size={32} />
            <h1>Internal Transfer</h1>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/transfer/new')}>
            <FiPlus /> New Transfer
          </button>
        </div>

        <div className="filter-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'draft' ? 'active' : ''} onClick={() => setFilter('draft')}>Draft</button>
          <button className={filter === 'waiting' ? 'active' : ''} onClick={() => setFilter('waiting')}>Waiting</button>
          <button className={filter === 'ready' ? 'active' : ''} onClick={() => setFilter('ready')}>Ready</button>
          <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>Done</button>
        </div>

        <div className="transfer-grid">
          {filteredTransfers.map(transfer => (
            <div key={transfer._id} className="transfer-card">
              <div className="card-header">
                <h3>{transfer.transferNo}</h3>
                <span className={`status-badge status-${transfer.status}`}>
                  {transfer.status}
                </span>
              </div>
              <div className="card-body">
                <p><strong>From:</strong> {transfer.fromWarehouse}</p>
                <p><strong>To:</strong> {transfer.toWarehouse}</p>
                <p><strong>Schedule:</strong> {format(new Date(transfer.scheduleDate), 'MMM dd, yyyy')}</p>
                <p><strong>Items:</strong> {transfer.totalItems}</p>
              </div>
              <div className="card-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/transfer/${transfer._id}`)}>
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

export default Transfer;
