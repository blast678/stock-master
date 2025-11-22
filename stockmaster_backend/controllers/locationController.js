import Location from '../models/Location.js';
export const getAll = async (req, res) => res.json(await Location.find());
export const createOne = async (req, res) => res.status(201).json(await Location.create(req.body));
export const updateOne = async (req, res) => res.json(await Location.findByIdAndUpdate(req.params.id, req.body, { new: true }));
export const deleteOne = async (req, res) => { await Location.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
