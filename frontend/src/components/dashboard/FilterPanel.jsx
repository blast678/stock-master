import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import "../../pages/Dashboard.css";


const FilterPanel = ({ onFilterChange, warehouses, categories }) => {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    warehouse: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      type: '',
      status: '',
      warehouse: '',
      category: '',
      startDate: '',
      endDate: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="filter-panel">
      <button className="filter-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FiFilter /> Filters
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-header">
            <h3>Filter Operations</h3>
            <button onClick={() => setIsOpen(false)}>
              <FiX />
            </button>
          </div>

          <div className="filter-body">
            <div className="filter-group">
              <label>Document Type</label>
              <select name="type" value={filters.type} onChange={handleChange}>
                <option value="">All Types</option>
                <option value="receipts">Receipts</option>
                <option value="deliveries">Deliveries</option>
                <option value="transfers">Internal Transfers</option>
                <option value="adjustments">Adjustments</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleChange}>
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="waiting">Waiting</option>
                <option value="ready">Ready</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Warehouse</label>
              <select name="warehouse" value={filters.warehouse} onChange={handleChange}>
                <option value="">All Warehouses</option>
                {warehouses?.map(wh => (
                  <option key={wh._id} value={wh._id}>{wh.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select name="category" value={filters.category} onChange={handleChange}>
                <option value="">All Categories</option>
                {categories?.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="filter-actions">
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
