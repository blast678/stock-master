import express from 'express';
import * as ctrl from '../controllers/transactionLogController.js';
const r = express.Router();
r.get('/', ctrl.getAll);
export default r;
