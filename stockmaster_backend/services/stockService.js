import Stock from '../models/Stock.js';
import StockLedger from '../models/StockLedger.js';
import TransactionLog from '../models/TransactionLog.js';

// increase or decrease stock and write ledger + transaction log
export async function changeStock({ productId, locationId, delta, type, refId }) {
  // delta: positive for IN, negative for OUT
  const stock = await Stock.findOneAndUpdate(
    { product: productId, location: locationId },
    { $inc: { quantity: delta } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // compute ledger balance
  const balance = stock.quantity;

  await StockLedger.create({
    product: productId,
    location: locationId,
    change: delta,
    balance,
    refType: type,
    refId
  });

  await TransactionLog.create({
    product: productId,
    location: locationId,
    type: delta > 0 ? 'IN' : 'OUT',
    quantity: Math.abs(delta),
    reference: refId
  });

  return stock;
}
