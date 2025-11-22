import Vendor from '../models/Vendor.js';

export const getAll = async (req, res) => res.json(await Vendor.find());
export const createOne = async (req, res) => res.status(201).json(await Vendor.create(req.body));
export const updateOne = async (req, res) => res.json(await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true }));
export const deleteOne = async (req, res) => { await Vendor.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
