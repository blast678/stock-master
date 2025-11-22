import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEye, FiEdit } from 'react-icons/fi';
import { format } from 'date-fns';
import MainLayout from '../layouts/MainLayout';
import './Adjustment.css';

const Adjustment = () => {
  const navigate = useNavigate();
  const [adjustments, setAdjustments] = useState([]);

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    try {
      // Mock data
      setAdjustments([
        { _id: '1', adjustmentNo: 'ADJ/001', reason: 'Damaged goods', date: new Date(), warehouse: 'Main Warehouse', totalItems: 2, status: 'done' },
        { _id: '2', adjustmentNo: 'ADJ/002', reason: 'Stock count mismatch', date: new Date(), warehouse: 'Branch Store', totalItems: 3, status: 'draft' },
      ]);
    } catch (error) {
      console.error('Failed to fetch adjustments:', error);
    }
  };

  return (
    <MainLayout>
      <div className="adjustment-page">
        <div className="page-header">
          <div className="header-left">
            <FiEdit size={32} />
            <h1>Stock Adjustment</h1>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/adjustment/new')}>
            <FiPlus /> New Adjustment
          </button>
        </div>

        <div className="adjustments-table-container">
          <table className="adjustments-table">
            <thead>
              <tr>
                <th>Adjustment No.</th>
                <th>Reason</th>
                <th>Warehouse</th>
                <th>Date</th>
                <th>Items</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map(adj => (
                <tr key={adj._id}>
                  <td><span className="ref-number">{adj.adjustmentNo}</span></td>
                  <td>{adj.reason}</td>
                  <td>{adj.warehouse}</td>
                  <td>{format(new Date(adj.date), 'MMM dd, yyyy')}</td>
                  <td>{adj.totalItems}</td>
                  <td>
                    <span className={`status-badge status-${adj.status}`}>
                      {adj.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => navigate(`/adjustment/${adj._id}`)}>
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Adjustment;
