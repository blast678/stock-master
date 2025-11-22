import { useState } from "react";
import { FiSave } from "react-icons/fi";
import "./LocationForm.css";

const LocationForm = ({ warehouses = [], onSave, initialData = null }) => {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      shortCode: "",
      warehouse: ""
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
    // You could also clear the form here if needed
  };

  return (
    <div className="location-form-container">
      <div className="location-form-header">location</div>
      <form className="location-form" onSubmit={handleSubmit}>
        <div className="location-form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Location name"
            required
          />
        </div>
        <div className="location-form-group">
          <label>Short Code:</label>
          <input
            type="text"
            name="shortCode"
            value={form.shortCode}
            onChange={handleChange}
            placeholder="Short code"
            required
          />
        </div>
        <div className="location-form-group">
          <label>warehouse:</label>
          <select
            name="warehouse"
            value={form.warehouse}
            onChange={handleChange}
            required
          >
            <option value="">Select warehouse</option>
            {warehouses.map((wh) => (
              <option key={wh._id || wh.value} value={wh._id || wh.value}>
                {wh.name || wh.label}
              </option>
            ))}
          </select>
        </div>
        <div className="location-form-actions">
          <button className="btn btn-save" type="submit">
            <FiSave /> Save
          </button>
        </div>
      </form>
      <div className="location-form-footer">
        This holds the multiple locations of warehouse, rooms, etc..
      </div>
    </div>
  );
};

export default LocationForm;
