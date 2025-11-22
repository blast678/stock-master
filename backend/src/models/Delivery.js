const mongoose = require('mongoose');

const DeliveryProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const DeliverySchema = new mongoose.Schema(
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
    deliveryAddress: { 
      type: String, 
      required: true 
    },
    responsible: { 
      type: String, 
      required: true 
    },
    operationType: { 
      type: String, 
      enum: ['Normal', 'Urgent'], 
      default: 'Normal' 
    },
    products: [DeliveryProductSchema],
    status: { 
      type: String, 
      enum: ['Draft', 'Waiting', 'Ready', 'Done', 'Cancelled'], 
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
DeliverySchema.pre('save', async function(next) {
  if (!this.reference) {
    const count = await mongoose.model('Delivery').countDocuments();
    this.reference = `${this.from}/OUT/${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Delivery', DeliverySchema);
