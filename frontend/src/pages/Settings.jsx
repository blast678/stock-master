import { useState } from 'react';
import { FiSettings, FiPlus } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('warehouses');
  const [warehouses, setWarehouses] = useState([
    { _id: '1', name: 'Main Warehouse', code: 'WH', location: 'City Center' },
    { _id: '2', name: 'Branch Store', code: 'BS', location: 'North Zone' },
  ]);

  const [locations, setLocations] = useState([
    { _id: '1', name: 'Rack A1', code: 'A1', warehouse: 'Main Warehouse' },
    { _id: '2', name: 'Shelf B2', code: 'B2', warehouse: 'Branch Store' },
  ]);

  const [categories, setCategories] = useState([
    { _id: '1', name: 'Raw Material', description: 'Unprocessed materials' },
    { _id: '2', name: 'Furniture', description: 'Office and home furniture' },
  ]);

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
          <button 
            className={activeTab === 'warehouses' ? 'active' : ''} 
            onClick={() => setActiveTab('warehouses')}
          >
            Warehouses
          </button>
          <button 
            className={activeTab === 'locations' ? 'active' : ''} 
            onClick={() => setActiveTab('locations')}
          >
            Locations
          </button>
          <button 
            className={activeTab === 'categories' ? 'active' : ''} 
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
        </div>

        {activeTab === 'warehouses' && (
          <div className="settings-content">
            <div className="content-header">
              <h2>Warehouses</h2>
              <button className="btn btn-primary">
                <FiPlus /> Add Warehouse
              </button>
            </div>
            <table className="settings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map(wh => (
                  <tr key={wh._id}>
                    <td>{wh.name}</td>
                    <td><span className="code-badge">{wh.code}</span></td>
                    <td>{wh.location}</td>
                    <td>
                      <button className="btn-icon btn-edit">Edit</button>
                      <button className="btn-icon btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="settings-content">
            <div className="content-header">
              <h2>Locations / Storage Areas</h2>
              <button className="btn btn-primary">
                <FiPlus /> Add Location
              </button>
            </div>
            <table className="settings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Warehouse</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map(loc => (
                  <tr key={loc._id}>
                    <td>{loc.name}</td>
                    <td><span className="code-badge">{loc.code}</span></td>
                    <td>{loc.warehouse}</td>
                    <td>
                      <button className="btn-icon btn-edit">Edit</button>
                      <button className="btn-icon btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="settings-content">
            <div className="content-header">
              <h2>Product Categories</h2>
              <button className="btn btn-primary">
                <FiPlus /> Add Category
              </button>
            </div>
            <table className="settings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id}>
                    <td>{cat.name}</td>
                    <td>{cat.description}</td>
                    <td>
                      <button className="btn-icon btn-edit">Edit</button>
                      <button className="btn-icon btn-delete">Delete</button>
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
