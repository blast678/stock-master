import express from 'express';
import * as ctrl from '../controllers/vendorController.js';
const r = express.Router();
r.get('/', ctrl.getAll);
r.post('/', ctrl.createOne);
r.put('/:id', ctrl.updateOne);
r.delete('/:id', ctrl.deleteOne);
export default r;
