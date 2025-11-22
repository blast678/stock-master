import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  loginId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['inventory_manager','warehouse_staff','admin'], default: 'warehouse_staff' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.toJSON = function(){
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
