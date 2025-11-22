import TransactionLog from '../models/TransactionLog.js';
export const getAll = async (req, res) => res.json(await TransactionLog.find().populate('product location'));
