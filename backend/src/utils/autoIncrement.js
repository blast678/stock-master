const Delivery = require('../models/Delivery');

async function getNextDeliveryRef(warehouseId = 'WH') {
  // Find the latest Delivery with matching warehouse (from:) and OUT operation
  const last = await Delivery.find({ reference: { $regex: `^${warehouseId}/OUT/` } })
    .sort({ createdAt: -1 })
    .limit(1);
  let nextId = 1;
  if (last.length > 0) {
    const [, , id] = last[0].reference.split('/');
    nextId = parseInt(id, 10) + 1;
  }
  // Format: WH/OUT/0001
  return `${warehouseId}/OUT/${String(nextId).padStart(4, '0')}`;
}

module.exports = { getNextDeliveryRef };
