import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import './Settings.css';

import { addWarehouse } from '../mock/mockData';

const AddWarehouse = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    addWarehouse({
      name,
      code,
      location: address
    });

    navigate('/settings', { state: { openTab: 'warehouses' } });
  };

  return (
    <MainLayout>
      <div className="settings-page">
        <div className="page-header">
          <div className="header-left">
            <FiPlus size={32} />
            <h1>Add Warehouse</h1>
          </div>
        </div>

        <div className="settings-content form-content">
          <form className="settings-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label>Warehouse Name</label>
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
              <label>Warehouse Address</label>
              <input 
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" type="submit">
              <FiPlus /> Save Warehouse
            </button>

          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddWarehouse;
