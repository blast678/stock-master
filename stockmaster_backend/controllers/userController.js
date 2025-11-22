import User from '../models/User.js';
export const getAll = async (req, res) => res.json(await User.find());
export const createOne = async (req, res) => {
  const u = await User.create(req.body);
  res.status(201).json(u);
};
export const deleteOne = async (req, res) => { await User.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
