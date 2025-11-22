import Stock from '../models/Stock.js';

export const getAll = async (req, res) => res.json(await Stock.find().populate('product location'));
export const getOne = async (req, res) => {
  const s = await Stock.findById(req.params.id).populate('product location');
  if(!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
};
