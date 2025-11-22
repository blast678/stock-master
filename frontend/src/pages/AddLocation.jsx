import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import './Settings.css';

import { warehouses, addLocation } from '../mock/mockData';

const AddLocation = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [warehouse, setWarehouse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    addLocation({
      name,
      code,
      warehouse
    });

    navigate('/settings', { state: { openTab: 'locations' } });
  };

  return (
    <MainLayout>
      <div className="settings-page">

        <div className="page-header">
          <div className="header-left">
            <FiPlus size={32} />
            <h1>Add Location</h1>
          </div>
        </div>

        <div className="settings-content form-content">
          <form className="settings-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Location Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Short Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Warehouse (Short Code)</label>
              <select
                required
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              >
                <option value="">Select warehouse</option>
                {warehouses.map(w => (
                  <option value={w.code} key={w._id}>
                    {w.code} — {w.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" type="submit">
              <FiPlus /> Save Location
            </button>

          </form>
        </div>

      </div>
    </MainLayout>
  );
};

export default AddLocation;
