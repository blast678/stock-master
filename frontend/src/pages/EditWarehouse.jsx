import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { warehouses, updateWarehouse } from '../mock/mockData';
import { FiPlus } from 'react-icons/fi';
import './Settings.css';

const EditWarehouse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');

  useEffect(()=>{
    const w = warehouses.find(w=>w._id===id);
    if(w){
      setName(w.name); setCode(w.code); setLocation(w.location);
    }else navigate('/settings');
  }, [id, navigate]);

  const handleSubmit = e => {
    e.preventDefault();
    updateWarehouse(id, { name, code, location });
    navigate('/settings', { state:{ openTab:'warehouses' } });
  };

  return (
    <MainLayout>
      <div className="settings-page">
        <div className="page-header">
          <div className="header-left"><FiPlus size={32}/><h1>Edit Warehouse</h1></div>
        </div>
        <div className="settings-content form-content">
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-group"><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required/></div>
            <div className="form-group"><label>Short Code</label><input value={code} onChange={e=>setCode(e.target.value)} required/></div>
            <div className="form-group"><label>Location</label><input value={location} onChange={e=>setLocation(e.target.value)} required/></div>
            <button className="btn btn-primary" type="submit"><FiPlus/> Save Changes</button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditWarehouse;
