const mongoose = require('mongoose');

const ReceiptProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const ReceiptSchema = new mongoose.Schema(
  {
    reference: { 
      type: String, 
      required: true, 
      unique: true 
    },
    from: { 
      type: String, 
      required: true 
    },
    to: { 
      type: String, 
      required: true 
    },
    contact: { 
      type: String, 
      default: '' 
    },
    scheduleDate: { 
      type: Date, 
      required: true 
    },
    responsible: { 
      type: String, 
      required: true 
    },
    products: [ReceiptProductSchema],
    status: { 
      type: String, 
      enum: ['Draft', 'Ready', 'Done'], 
      default: 'Draft' 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  { 
    timestamps: true 
  }
);

// Auto-generate reference before save
ReceiptSchema.pre('save', async function(next) {
  if (!this.reference) {
    const count = await mongoose.model('Receipt').countDocuments();
    this.reference = `${this.to}/IN/${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
