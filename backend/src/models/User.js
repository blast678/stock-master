const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  loginId: {
    type: String,
    required: [true, 'Login ID is required'],
    unique: true,
    trim: true,
    minlength: [6, 'Login ID must be between 6-12 characters'],
    maxlength: [12, 'Login ID must be between 6-12 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]{6,12}$/.test(v);
      },
      message: 'Login ID must be 6-12 characters (letters, numbers, underscore only)'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function(v) {
        // Must contain: lowercase, uppercase, special char, min 8 chars
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(v);
      },
      message: 'Password must contain at least one lowercase, one uppercase, one special character, and be 8+ characters'
    }
  },
  role: {
    type: String,
    enum: ['inventory_manager', 'warehouse_staff', 'admin'],
    default: 'warehouse_staff'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
