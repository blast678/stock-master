import Product from '../models/Product.js';

export const getAll = async (req, res) => {
  const items = await Product.find();
  res.json(items);
};

export const getOne = async (req, res) => {
  const item = await Product.findById(req.params.id);
  if(!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

export const createOne = async (req, res) => {
  const item = await Product.create(req.body);
  res.status(201).json(item);
};

export const updateOne = async (req, res) => {
  const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
};

export const deleteOne = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
