import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCheckSquare, FiPrinter, FiXCircle, FiPlus, FiSave, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import { deliveryService } from '../services/deliveryService';
import { productService } from '../services/productService';
import './DeliveryForm.css';

const DeliveryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [productList, setProductList] = useState([]);
  const [form, setForm] = useState({
    from: 'WH',
    to: '',
    contact: '',
    scheduleDate: '',
    deliveryAddress: '',
    operationType: 'Normal',
    products: [{ product: '', quantity: 1 }]
  });

  const [status, setStatus] = useState('Draft');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (isEdit) fetchDelivery();
    // eslint-disable-next-line
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProductList(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchDelivery = async () => {
    try {
      const response = await deliveryService.getById(id);
      const delivery = response.data;
      setForm({
        from: delivery.from,
        to: delivery.to,
        contact: delivery.contact,
        scheduleDate: delivery.scheduleDate.split('T')[0],
        deliveryAddress: delivery.deliveryAddress,
        operationType: delivery.operationType,
        products: delivery.products.map(p => ({
          product: p.product._id,
          quantity: p.quantity
        }))
      });
      setStatus(delivery.status);
    } catch (error) {
      console.error('Failed to fetch delivery:', error);
      alert('Failed to load delivery');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleProductChange = (idx, field, value) => {
    const products = [...form.products];
    products[idx][field] = value;
    setForm({ ...form, products });
  };

  const addProduct = () => {
    setForm({
      ...form,
      products: [...form.products, { product: '', quantity: 1 }]
    });
  };

  const removeProduct = (idx) => {
    setForm({
      ...form,
      products: form.products.filter((_, i) => i !== idx)
    });
  };

  // Check for out of stock
  const outOfStocks = form.products.filter(prod => {
    const matched = productList.find(p => p._id === prod.product);
    if (!matched) return false;
    return prod.quantity > matched.currentStock;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (outOfStocks.length > 0) {
      setLoading(false);
      alert("Cannot save: One or more products are out of stock!");
      return;
    }
    
    try {
      if (isEdit) {
        await deliveryService.update(id, { ...form, status });
      } else {
        await deliveryService.create(form);
      }
      navigate('/delivery');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save delivery');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!isEdit) return;
    if (outOfStocks.length > 0) {
      alert("Cannot validate: One or more products are out of stock!");
      return;
    }
    if (window.confirm('Are you sure? This will deduct stock and mark as Done.')) {
      try {
        await deliveryService.validate(id);
        alert('Delivery validated successfully!');
        navigate('/delivery');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to validate delivery');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="delivery-form-page no-print">
        <button className="btn btn-back" onClick={() => navigate('/delivery')}>
          <FiArrowLeft /> Back
        </button>

        <div className="form-actions-bar">
          <button type="button" className="btn" onClick={() => navigate('/delivery/new')}>
            <FiPlus /> New
          </button>
          <button 
            type="button" 
            className="btn" 
            disabled={!isEdit || status === 'Done'}
            onClick={handleValidate}
          >
            <FiCheckSquare /> Validate
          </button>
          <button type="button" className="btn" onClick={handlePrint}>
            <FiPrinter /> Print
          </button>
          <button type="button" className="btn btn-cancel" onClick={() => navigate('/delivery')}>
            <FiXCircle /> Cancel
          </button>
          <div className="current-status">
            Status: <b>{status}</b>
          </div>
        </div>

        <form className="delivery-form-card" onSubmit={handleSubmit}>
          <h2>Delivery Order</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Reference</label>
              <input type="text" placeholder="Auto-generated" disabled />
            </div>
            <div className="form-group">
              <label>Schedule Date *</label>
              <input
                name="scheduleDate"
                type="date"
                value={form.scheduleDate}
                onChange={handleChange}
                disabled={status === 'Done'}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>From *</label>
              <input
                name="from"
                value={form.from}
                onChange={handleChange}
                disabled={status === 'Done'}
                required
              />
            </div>
            <div className="form-group">
              <label>To (Customer) *</label>
              <input
                name="to"
                value={form.to}
                onChange={handleChange}
                disabled={status === 'Done'}
                placeholder="Customer name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contact</label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              disabled={status === 'Done'}
              placeholder="Contact person"
            />
          </div>

          <div className="form-group">
            <label>Delivery Address *</label>
            <input
              name="deliveryAddress"
              value={form.deliveryAddress}
              onChange={handleChange}
              disabled={status === 'Done'}
              placeholder="Full delivery address"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Operation Type *</label>
              <select
                name="operationType"
                value={form.operationType}
                onChange={handleChange}
                disabled={status === 'Done'}
                required
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Responsible</label>
              <input value={user?.loginId || ''} disabled />
            </div>
          </div>

          {outOfStocks.length > 0 && (
            <div className="alert-error">
              Alert: Some products are not in stock!
            </div>
          )}

          <div className="products-section">
            <label>Products</label>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Available Stock</th>
                  <th>Quantity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.products.map((prod, idx) => {
                  const matched = productList.find(p => p._id === prod.product);
                  const outOfStock = matched && prod.quantity > matched.currentStock;
                  return (
                    <tr key={idx} className={outOfStock ? "out-of-stock-row" : ""}>
                      <td>
                        <select
                          value={prod.product}
                          onChange={e => handleProductChange(idx, 'product', e.target.value)}
                          disabled={status === 'Done'}
                          required
                        >
                          <option value="">Select product</option>
                          {productList.map(p => (
                            <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                          ))}
                        </select>
                      </td>
                      <td>{matched ? matched.currentStock : '-'}</td>
                      <td>
                        <input
                          type="number"
                          value={prod.quantity}
                          onChange={e => handleProductChange(idx, 'quantity', parseInt(e.target.value))}
                          min="1"
                          disabled={status === 'Done'}
                          style={{ width: '80px' }}
                          required
                        />
                      </td>
                      <td>
                        {form.products.length > 1 && status !== 'Done' && (
                          <button
                            type="button"
                            onClick={() => removeProduct(idx)}
                            className="btn-remove"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {status !== 'Done' && (
                  <tr>
                    <td colSpan="4">
                      <button type="button" className="btn btn-add" onClick={addProduct}>
                        <FiPlus /> Add Product
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {status !== 'Done' && (
            <div className="form-submit">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FiSave /> {loading ? 'Saving...' : 'Save Delivery'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* PRINTABLE VERSION */}
      <div className="print-only">
        <div className="print-header">
          <h1>DELIVERY ORDER</h1>
          <p>Reference: {id ? 'Loading...' : 'New Delivery'}</p>
        </div>
        <div className="print-details">
          <div className="print-row">
            <div><strong>From:</strong> {form.from}</div>
            <div><strong>To:</strong> {form.to}</div>
          </div>
          <div className="print-row">
            <div><strong>Contact:</strong> {form.contact}</div>
            <div><strong>Date:</strong> {form.scheduleDate}</div>
          </div>
          <div><strong>Address:</strong> {form.deliveryAddress}</div>
          <div><strong>Responsible:</strong> {user?.loginId}</div>
        </div>
        <table className="print-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {form.products.map((prod, idx) => {
              const matched = productList.find(p => p._id === prod.product);
              return (
                <tr key={idx}>
                  <td>{matched ? `${matched.name} (${matched.sku})` : 'Select product'}</td>
                  <td>{prod.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="print-footer">
          <p>Status: {status}</p>
          <p>Generated on: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryForm;
