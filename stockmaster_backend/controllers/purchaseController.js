import PurchaseTransaction from '../models/PurchaseTransaction.js';
import { changeStock } from '../services/stockService.js';

export const getAll = async (req, res) => res.json(await PurchaseTransaction.find().populate('product vendor location'));
export const createOne = async (req, res) => {
  const tx = await PurchaseTransaction.create(req.body);
  // increase stock
  await changeStock({ productId: tx.product, locationId: tx.location, delta: tx.quantity, type: 'Purchase', refId: tx._id });
  res.status(201).json(tx);
};
export const updateOne = async (req, res) => {
  // For simplicity, do not auto-adjust stock on update. You can implement diff logic if needed.
  const tx = await PurchaseTransaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(tx);
};
export const deleteOne = async (req, res) => {
  // Deleting a purchase does NOT revert stock automatically in this simple implementation
  await PurchaseTransaction.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
