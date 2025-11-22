import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db.js';
import Vendor from '../models/Vendor.js';
import Location from '../models/Location.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import PurchaseTransaction from '../models/PurchaseTransaction.js';
import IssueTransaction from '../models/IssueTransaction.js';
import { changeStock } from '../services/stockService.js';

const run = async () => {
  await connectDB();
  console.log('Seeding data...');

  await Vendor.deleteMany({});
  await Location.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});
  await PurchaseTransaction.deleteMany({});
  await IssueTransaction.deleteMany({});

  const vendor = await Vendor.create({ name: 'Default Vendor', phone: '9999999999' });
  const loc = await Location.create({ name: 'Main Warehouse', address: 'HQ' });
  const p1 = await Product.create({ name: 'Bolt M8', sku: 'BOLT-M8' });
  const p2 = await Product.create({ name: 'Nut M8', sku: 'NUT-M8' });

  const admin = await User.create({ loginId: 'admin001', email: 'admin@example.com', password: 'Admin@123', role: 'admin' });

  const pur = await PurchaseTransaction.create({ product: p1._id, vendor: vendor._id, location: loc._id, quantity: 100, cost: 200 });
  await changeStock({ productId: p1._id, locationId: loc._id, delta: pur.quantity, type: 'SeedPurchase', refId: pur._id });

  const pur2 = await PurchaseTransaction.create({ product: p2._id, vendor: vendor._id, location: loc._id, quantity: 50 });
  await changeStock({ productId: p2._id, locationId: loc._id, delta: pur2.quantity, type: 'SeedPurchase', refId: pur2._id });

  console.log('Seed complete');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
