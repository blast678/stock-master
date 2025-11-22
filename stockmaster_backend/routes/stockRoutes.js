import express from 'express';
import * as ctrl from '../controllers/stockController.js';
const r = express.Router();
r.get('/', ctrl.getAll);
r.get('/:id', ctrl.getOne);
export default r;
