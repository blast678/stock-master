import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import { productService } from '../services/productService';
import './ProductForm.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    unitOfMeasure: 'pcs',
    unitPrice: '',
    currentStock: '0',
    reorderLevel: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getById(id);
      const product = response.data;
      setForm({
        name: product.name,
        sku: product.sku,
        category: product.category,
        description: product.description || '',
        unitOfMeasure: product.unitOfMeasure,
        unitPrice: product.unitPrice.toString(),
        currentStock: product.currentStock.toString(),
        reorderLevel: product.reorderLevel.toString()
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
      alert('Failed to load product');
      navigate('/products');
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
      const data = {
        ...form,
        unitPrice: parseFloat(form.unitPrice),
        currentStock: parseInt(form.currentStock),
        reorderLevel: parseInt(form.reorderLevel)
      };

      if (isEdit) {
        await productService.update(id, data);
        alert('Product updated successfully');
      } else {
        await productService.create(data);
        alert('Product created successfully');
      }
      navigate('/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      alert(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="product-form-page">
        <button className="btn btn-back" onClick={() => navigate('/products')}>
          <FiArrowLeft /> Back to Products
        </button>

        <div className="product-form-card">
          <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  required
                  placeholder="e.g., PROD001"
                  disabled={isEdit}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Raw Material">Raw Material</option>
                  <option value="Finished Goods">Finished Goods</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Unit of Measure *</label>
                <select
                  name="unitOfMeasure"
                  value={form.unitOfMeasure}
                  onChange={handleChange}
                  required
                >
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="ltr">Liters</option>
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
                placeholder="Enter product description"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Unit Price (₹) *</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={form.unitPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Current Stock</label>
                <input
                  type="number"
                  name="currentStock"
                  value={form.currentStock}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Reorder Level *</label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={form.reorderLevel}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FiSave /> {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductForm;
