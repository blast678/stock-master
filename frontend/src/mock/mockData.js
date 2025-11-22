// src/mock/mockData.js

export let warehouses = [
  { _id: '1', name: 'Main Warehouse', code: 'WH', location: 'City Center' },
  { _id: '2', name: 'Branch Store', code: 'BS', location: 'North Zone' },
];

export let locations = [
  { _id: '1', name: 'Rack A1', code: 'A1', warehouse: 'WH' },
  { _id: '2', name: 'Shelf B2', code: 'B2', warehouse: 'BS' },
];

export const addWarehouse = (data) => {
  warehouses.push({ _id: Date.now().toString(), ...data });
};

export const addLocation = (data) => {
  locations.push({ _id: Date.now().toString(), ...data });
};

export const updateWarehouse = (id, updatedData) => {
  warehouses = warehouses.map(w => w._id === id ? { ...w, ...updatedData } : w);
};

export const updateLocation = (id, updatedData) => {
  locations = locations.map(l => l._id === id ? { ...l, ...updatedData } : l);
};

export const deleteWarehouse = (id) => {
  const wh = warehouses.find(w => w._id === id);
  warehouses = warehouses.filter(w => w._id !== id);
  locations = locations.filter(l => l.warehouse !== wh?.code);
};

export const deleteLocation = (id) => {
  locations = locations.filter(l => l._id !== id);
};
