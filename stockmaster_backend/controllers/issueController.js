import IssueTransaction from '../models/IssueTransaction.js';
import { changeStock } from '../services/stockService.js';

export const getAll = async (req, res) => res.json(await IssueTransaction.find().populate('product location'));
export const createOne = async (req, res) => {
  const tx = await IssueTransaction.create(req.body);
  // decrease stock
  await changeStock({ productId: tx.product, locationId: tx.location, delta: -Math.abs(tx.quantity), type: 'Issue', refId: tx._id });
  res.status(201).json(tx);
};
export const updateOne = async (req, res) => {
  const tx = await IssueTransaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(tx);
};
export const deleteOne = async (req, res) => {
  await IssueTransaction.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
