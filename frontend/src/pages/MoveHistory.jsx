import { useState, useEffect } from 'react';
import { FiTruck, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';
import MainLayout from '../layouts/MainLayout';
import './MoveHistory.css';

const MoveHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState({
    type: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    try {
      // Mock data
      setHistory([
        { _id: '1', type: 'receipt', refNo: 'WH/IN/0001', product: 'Steel Rods', quantity: 100, warehouse: 'Main Warehouse', date: new Date(), user: 'john_doe' },
        { _id: '2', type: 'delivery', refNo: 'WH/OUT/0001', product: 'Wooden Chair', quantity: -25, warehouse: 'Main Warehouse', date: new Date(), user: 'jane_smith' },
        { _id: '3', type: 'transfer', refNo: 'WH/TRF/0001', product: 'Office Desk', quantity: 5, warehouse: 'Branch Store', date: new Date(), user: 'admin' },
        { _id: '4', type: 'adjustment', refNo: 'ADJ/001', product: 'Steel Rods', quantity: -2, warehouse: 'Main Warehouse', date: new Date(), user: 'john_doe' },
      ]);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  return (
    <MainLayout>
      <div className="history-page">
        <div className="page-header">
          <div className="header-left">
            <FiTruck size={32} />
            <h1>Move History</h1>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Type</label>
            <select name="type" value={filter.type} onChange={handleFilterChange}>
              <option value="all">All Types</option>
              <option value="receipt">Receipt</option>
              <option value="delivery">Delivery</option>
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

        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Reference No.</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Warehouse</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item._id}>
                  <td>{format(new Date(item.date), 'MMM dd, yyyy HH:mm')}</td>
                  <td>
                    <span className={`type-badge type-${item.type}`}>
                      {item.type}
                    </span>
                  </td>
                  <td><span className="ref-number">{item.refNo}</span></td>
                  <td>{item.product}</td>
                  <td>
                    <span className={item.quantity < 0 ? 'qty-negative' : 'qty-positive'}>
                      {item.quantity > 0 ? '+' : ''}{item.quantity}
                    </span>
                  </td>
                  <td>{item.warehouse}</td>
                  <td>{item.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default MoveHistory;
