import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { locations, warehouses, updateLocation } from '../mock/mockData';
import { FiPlus } from 'react-icons/fi';
import './Settings.css';

const EditLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [warehouse, setWarehouse] = useState('');

  useEffect(()=>{
    const loc = locations.find(l=>l._id===id);
    if(loc){
      setName(loc.name); setCode(loc.code); setWarehouse(loc.warehouse);
    }else navigate('/settings');
  }, [id, navigate]);

  const handleSubmit = e => {
    e.preventDefault();
    updateLocation(id, { name, code, warehouse });
    navigate('/settings', { state:{ openTab:'locations' } });
  };

  return (
    <MainLayout>
      <div className="settings-page">
        <div className="page-header">
          <div className="header-left"><FiPlus size={32}/><h1>Edit Location</h1></div>
        </div>
        <div className="settings-content form-content">
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-group"><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required/></div>
            <div className="form-group"><label>Short Code</label><input value={code} onChange={e=>setCode(e.target.value)} required/></div>
            <div className="form-group">
              <label>Warehouse</label>
              <select value={warehouse} onChange={e=>setWarehouse(e.target.value)} required>
                <option value="">Select Warehouse</option>
                {warehouses.map(w=><option key={w._id} value={w.code}>{w.code} - {w.name}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" type="submit"><FiPlus/> Save Changes</button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditLocation;
