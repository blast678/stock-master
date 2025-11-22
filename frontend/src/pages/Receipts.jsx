import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEye, FiDownload } from 'react-icons/fi';
import { format } from 'date-fns';
import MainLayout from '../layouts/MainLayout';
import './Receipts.css';

const Receipts = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      // TODO: API call
      // Mock data
      setReceipts([
        { _id: '1', receiptNo: 'WH/IN/0001', supplier: 'ABC Suppliers', scheduleDate: new Date(), status: 'done', totalItems: 3 },
        { _id: '2', receiptNo: 'WH/IN/0002', supplier: 'XYZ Vendor', scheduleDate: new Date(), status: 'ready', totalItems: 5 },
        { _id: '3', receiptNo: 'WH/IN/0003', supplier: 'Steel Corp', scheduleDate: new Date(), status: 'draft', totalItems: 2 },
      ]);
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
    }
  };

  const filteredReceipts = filter === 'all' 
    ? receipts 
    : receipts.filter(r => r.status === filter);

  return (
    <MainLayout>
      <div className="receipts-page">
        <div className="page-header">
          <div className="header-left">
            <FiDownload size={32} />
            <h1>Receipts (Incoming Stock)</h1>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/receipts/new')}>
            <FiPlus /> New Receipt
          </button>
        </div>

        <div className="filter-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            All
          </button>
          <button className={filter === 'draft' ? 'active' : ''} onClick={() => setFilter('draft')}>
            Draft
          </button>
          <button className={filter === 'ready' ? 'active' : ''} onClick={() => setFilter('ready')}>
            Ready
          </button>
          <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>
            Done
          </button>
        </div>

        <div className="receipts-grid">
          {filteredReceipts.map(receipt => (
            <div key={receipt._id} className="receipt-card">
              <div className="card-header">
                <h3>{receipt.receiptNo}</h3>
                <span className={`status-badge status-${receipt.status}`}>
                  {receipt.status}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Supplier:</strong> {receipt.supplier}</p>
                <p><strong>Schedule:</strong> {format(new Date(receipt.scheduleDate), 'MMM dd, yyyy')}</p>
                <p><strong>Items:</strong> {receipt.totalItems}</p>
              </div>
              <div className="card-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/receipts/${receipt._id}`)}>
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

export default Receipts;
