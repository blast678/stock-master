import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiSave } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    loginId: user?.loginId || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to update profile
    console.log('Profile update:', form);
  };

  return (
    <MainLayout>
      <div className="profile-page">
        <div className="page-header">
          <div className="header-left">
            <FiUser size={32} />
            <h1>My Profile</h1>
          </div>
        </div>

        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-avatar">
              <FiUser size={60} />
            </div>
            <div className="profile-info">
              <h2>{user?.loginId}</h2>
              <p className="role-badge">{user?.role}</p>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Account Information</h3>
              <div className="form-group">
                <label>Login ID</label>
                <input
                  type="text"
                  name="loginId"
                  value={form.loginId}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <FiSave /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
