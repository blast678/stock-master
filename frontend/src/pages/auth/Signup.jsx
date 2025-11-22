import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPackage, FiCheck, FiX } from 'react-icons/fi';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    loginId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasSpecial: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');

    // Validate password on change
    if (name === 'password') {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasLowercase: /[a-z]/.test(value),
        hasUppercase: /[A-Z]/.test(value),
        hasSpecial: /[@$!%*?&#]/.test(value)
      });
    }
  };

  const validateForm = () => {
    // Login ID validation
    if (formData.loginId.length < 6 || formData.loginId.length > 12) {
      setError('Login ID must be between 6-12 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.loginId)) {
      setError('Login ID can only contain letters, numbers, and underscores');
      return false;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!Object.values(passwordValidation).every(Boolean)) {
      setError('Password does not meet all requirements');
      return false;
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <FiPackage size={40} />
            <h1>StockMaster</h1>
          </div>
          <h2>Create Account</h2>
          <p>Join us to manage your inventory efficiently</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="loginId">Login ID</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                id="loginId"
                name="loginId"
                placeholder="6-12 characters"
                value={formData.loginId}
                onChange={handleChange}
                minLength={6}
                maxLength={12}
                required
                autoFocus
              />
            </div>
            <small className="input-hint">Must be 6-12 characters (letters, numbers, underscore)</small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            
            {/* Password strength indicators */}
            <div className="password-requirements">
              <div className={`requirement ${passwordValidation.minLength ? 'valid' : ''}`}>
                {passwordValidation.minLength ? <FiCheck /> : <FiX />}
                <span>At least 8 characters</span>
              </div>
              <div className={`requirement ${passwordValidation.hasLowercase ? 'valid' : ''}`}>
                {passwordValidation.hasLowercase ? <FiCheck /> : <FiX />}
                <span>One lowercase letter</span>
              </div>
              <div className={`requirement ${passwordValidation.hasUppercase ? 'valid' : ''}`}>
                {passwordValidation.hasUppercase ? <FiCheck /> : <FiX />}
                <span>One uppercase letter</span>
              </div>
              <div className={`requirement ${passwordValidation.hasSpecial ? 'valid' : ''}`}>
                {passwordValidation.hasSpecial ? <FiCheck /> : <FiX />}
                <span>One special character (@$!%*?&#)</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>

      <div className="auth-illustration">
        <div className="illustration-content">
          <h2>Start Managing Smarter</h2>
          <p>Join thousands of businesses optimizing their inventory operations.</p>
          <div className="features">
            <div className="feature-item">
              <span>✓</span>
              <p>Easy Setup</p>
            </div>
            <div className="feature-item">
              <span>✓</span>
              <p>Secure & Reliable</p>
            </div>
            <div className="feature-item">
              <span>✓</span>
              <p>24/7 Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
