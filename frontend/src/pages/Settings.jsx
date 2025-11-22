import { useState, useEffect } from 'react';
import { FiSettings, FiPlus } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import './Settings.css';

import { 
  warehouses as mockWarehouses, 
  locations as mockLocations, 
  deleteWarehouse, 
  deleteLocation 
} from '../mock/mockData';

const Settings = () => {
  const navigate = useNavigate();
  const routeState = useLocation().state;

  const [activeTab, setActiveTab] = useState('warehouses');
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setWarehouses([...mockWarehouses]);
    setLocations([...mockLocations]);

    if (routeState?.openTab) {
      setActiveTab(routeState.openTab);
    }
  }, [routeState]);

  // Handlers
  const handleDeleteWarehouse = (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      deleteWarehouse(id);
      setWarehouses([...mockWarehouses]);
      setLocations([...mockLocations]);
    }
  };

  const handleDeleteLocation = (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      deleteLocation(id);
      setLocations([...mockLocations]);
    }
  };

  const handleEditWarehouse = (id) => navigate(`/settings/edit-warehouse/${id}`);
  const handleEditLocation = (id) => navigate(`/settings/edit-location/${id}`);

  return (
    <MainLayout>
      <div className="settings-page">
        <div className="page-header">
          <div className="header-left">
            <FiSettings size={32} />
            <h1>Settings</h1>
          </div>
        </div>

        <div className="settings-tabs">
          <button className={activeTab==='warehouses'?'active':''} onClick={()=>setActiveTab('warehouses')}>Warehouses</button>
          <button className={activeTab==='locations'?'active':''} onClick={()=>setActiveTab('locations')}>Locations</button>
          <button className={activeTab==='categories'?'active':''} onClick={()=>setActiveTab('categories')}>Categories</button>
        </div>

        {/* Warehouses */}
        {activeTab==='warehouses' && (
          <div className="settings-content">
            <div className="content-header">
              <h2>Warehouses</h2>
              <button className="btn btn-primary" onClick={()=>navigate('/settings/add-warehouse')}><FiPlus/> Add Warehouse</button>
            </div>

            <table className="settings-table">
              <thead>
                <tr>
                  <th>Name</th><th>Code</th><th>Location</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map(w => (
                  <tr key={w._id}>
                    <td>{w.name}</td>
                    <td><span className="code-badge">{w.code}</span></td>
                    <td>{w.location}</td>
                    <td>
                      <button className="btn-icon btn-edit" onClick={()=>handleEditWarehouse(w._id)}>Edit</button>
                      <button className="btn-icon btn-delete" onClick={()=>handleDeleteWarehouse(w._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Locations */}
        {activeTab==='locations' && (
          <div className="settings-content">
            <div className="content-header">
              <h2>Locations / Storage Areas</h2>
              <button className="btn btn-primary" onClick={()=>navigate('/settings/add-location')}><FiPlus/> Add Location</button>
            </div>

            <table className="settings-table">
              <thead>
                <tr>
                  <th>Name</th><th>Code</th><th>Warehouse</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map(l => (
                  <tr key={l._id}>
                    <td>{l.name}</td>
                    <td><span className="code-badge">{l.code}</span></td>
                    <td>{l.warehouse}</td>
                    <td>
                      <button className="btn-icon btn-edit" onClick={()=>handleEditLocation(l._id)}>Edit</button>
                      <button className="btn-icon btn-delete" onClick={()=>handleDeleteLocation(l._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Settings;
