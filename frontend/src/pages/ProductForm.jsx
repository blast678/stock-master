import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import './ProductForm.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    unitOfMeasure: 'pcs',
    unitPrice: '',
    reorderLevel: '',
    initialStock: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      // TODO: API call
      // const response = await productService.getProduct(id);
      // setForm(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // if (isEdit) {
      //   await productService.updateProduct(id, form);
      // } else {
      //   await productService.createProduct(form);
      // }
      navigate('/products');
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="product-form-page">
        <div className="page-header">
          <button className="btn btn-back" onClick={() => navigate('/products')}>
            <FiArrowLeft /> Back
          </button>
          <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="form-group">
                <label>SKU / Product Code *</label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="e.g., PROD001"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  <option value="Raw Material">Raw Material</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Unit of Measure *</label>
                <select name="unitOfMeasure" value={form.unitOfMeasure} onChange={handleChange} required>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ltr">Liters (ltr)</option>
                  <option value="box">Box</option>
                  <option value="unit">Unit</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Pricing & Stock</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Unit Price (₹) *</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={form.unitPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Reorder Level *</label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={form.reorderLevel}
                  onChange={handleChange}
                  placeholder="Minimum stock level"
                  min="0"
                  required
                />
              </div>
              {!isEdit && (
                <div className="form-group">
                  <label>Initial Stock (Optional)</label>
                  <input
                    type="number"
                    name="initialStock"
                    value={form.initialStock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default ProductForm;
