import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCheckSquare, FiPrinter, FiXCircle, FiPlus, FiSave, FiArrowLeft } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import './DeliveryForm.css';

const DeliveryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    deliveryNo: '',
    customer: '',
    scheduleDate: '',
    responsible: user?.loginId || '',
    products: [{ sku: '', name: '', quantity: '' }]
  });

  const [status, setStatus] = useState('draft');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleProductChange = (idx, e) => {
    const { name, value } = e.target;
    const products = [...form.products];
    products[idx][name] = value;
    setForm({ ...form, products });
  };

  const addProduct = () => {
    setForm({
      ...form,
      products: [...form.products, { sku: '', name: '', quantity: '' }]
    });
  };

  const removeProduct = (idx) => {
    setForm({
      ...form,
      products: form.products.filter((_, i) => i !== idx)
    });
  };

  const handleValidate = () => {
    if (status === 'ready') {
      setStatus('done');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save to API
    navigate('/delivery');
  };

  return (
    <MainLayout>
      <div className="delivery-form-page">
        <button className="btn btn-back" onClick={() => navigate('/delivery')}>
          <FiArrowLeft /> Back
        </button>

        <div className="form-actions-bar">
          <button type="button" className="btn" onClick={() => window.location.reload()}>
            <FiPlus /> New
          </button>
          <button type="button" className="btn" disabled={status !== 'ready'} onClick={handleValidate}>
            <FiCheckSquare /> Validate
          </button>
          <button type="button" className="btn" onClick={() => window.print()}>
            <FiPrinter /> Print
          </button>
          <button type="button" className="btn btn-cancel" onClick={() => navigate('/delivery')}>
            <FiXCircle /> Cancel
          </button>
          <div className="status-flow">
            <span className="current-status">Status: <b>{status}</b></span>
            <span className="flow-indicator">Draft &gt; Waiting &gt; Ready &gt; Done</span>
          </div>
        </div>

        <form className="delivery-form-card" onSubmit={handleSubmit}>
          <h2>Delivery</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Delivery No.</label>
              <input
                name="deliveryNo"
                value={form.deliveryNo}
                onChange={handleChange}
                placeholder="WH/OUT/0001"
                disabled={status !== 'draft'}
                required
              />
            </div>
            <div className="form-group">
              <label>Schedule Date</label>
              <input
                name="scheduleDate"
                type="date"
                value={form.scheduleDate}
                onChange={handleChange}
                disabled={status === 'done'}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Deliver To (Customer)</label>
            <input
              name="customer"
              value={form.customer}
              onChange={handleChange}
              disabled={status === 'done'}
              placeholder="Customer name"
              required
            />
          </div>

          <div className="form-group">
            <label>Responsible</label>
            <input
              name="responsible"
              value={form.responsible}
              disabled
              title="Auto-filled with logged-in user"
            />
          </div>

          <div className="products-section">
            <label>Products</label>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product (SKU & Name)</th>
                  <th>Quantity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.products.map((prod, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        name="sku"
                        value={prod.sku}
                        onChange={(e) => handleProductChange(idx, e)}
                        placeholder="SKU"
                        disabled={status === 'done'}
                        style={{ width: '80px', marginRight: '6px' }}
                        required
                      />
                      <input
                        name="name"
                        value={prod.name}
                        onChange={(e) => handleProductChange(idx, e)}
                        placeholder="Name"
                        disabled={status === 'done'}
                        required
                      />
                    </td>
                    <td>
                      <input
                        name="quantity"
                        type="number"
                        value={prod.quantity}
                        onChange={(e) => handleProductChange(idx, e)}
                        placeholder="0"
                        min={1}
                        disabled={status === 'done'}
                        required
                        style={{ width: '70px' }}
                      />
                    </td>
                    <td>
                      {form.products.length > 1 && status !== 'done' && (
                        <button type="button" onClick={() => removeProduct(idx)} className="btn-remove">
                          <FiXCircle />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {status !== 'done' && (
                  <tr>
                    <td colSpan={3}>
                      <button type="button" className="btn btn-add" onClick={addProduct}>
                        <FiPlus /> Add Product
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {status !== 'done' && (
            <div className="form-submit">
              <button type="submit" className="btn btn-primary">
                <FiSave /> Save Delivery
              </button>
            </div>
          )}
        </form>
      </div>
    </MainLayout>
  );
};

export default DeliveryForm;
