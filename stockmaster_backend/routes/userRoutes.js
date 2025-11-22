import express from 'express';
import * as ctrl from '../controllers/userController.js';
const r = express.Router();
r.get('/', ctrl.getAll);
r.post('/', ctrl.createOne);
r.delete('/:id', ctrl.deleteOne);
export default r;
