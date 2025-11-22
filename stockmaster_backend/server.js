import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import transactionLogRoutes from './routes/transactionLogRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
connectDB();

app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/transactions', transactionLogRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
