import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import { productService } from '../services/productService';
import './Products.css';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        setProducts(products.filter(p => p._id !== id));
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="products-page">
        <div className="page-header">
          <div className="header-left">
            <FiPackage size={32} />
            <h1>Products</h1>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/products/new')}>
            <FiPlus /> Add Product
          </button>
        </div>

        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                  <th>Unit Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">No products found</td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product._id} className={product.currentStock <= product.reorderLevel ? 'low-stock' : ''}>
                      <td><span className="sku-badge">{product.sku}</span></td>
                      <td><strong>{product.name}</strong></td>
                      <td>{product.category}</td>
                      <td>
                        <span className={`stock-badge ${product.currentStock <= product.reorderLevel ? 'low' : ''}`}>
                          {product.currentStock}
                        </span>
                      </td>
                      <td>{product.reorderLevel}</td>
                      <td>₹{product.unitPrice.toLocaleString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => navigate(`/products/edit/${product._id}`)}
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(product._id)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Products;
