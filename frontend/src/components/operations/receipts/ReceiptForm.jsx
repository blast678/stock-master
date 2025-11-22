import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { FiCheckSquare, FiPrinter, FiXCircle, FiPlus, FiSave } from "react-icons/fi";
import "./ReceiptForm.css";

const defaultProduct = { name: "", sku: "", quantity: "" };

const initialReceipt = {
  receiptNumber: "",
  receiveFrom: "",
  scheduleDate: "",
  responsible: "",
  products: [{ ...defaultProduct }]
};

const ReceiptForm = ({
  initialData = null,
  onSave,
  onCancel,
  onPrint
}) => {
  const { user } = useAuth();
  const [receipt, setReceipt] = useState(
    initialData || {
      ...initialReceipt,
      responsible: user ? user.loginId : ""
    }
  );
  const [status, setStatus] = useState("draft"); // draft, ready, done

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceipt((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (idx, e) => {
    const { name, value } = e.target;
    setReceipt((prev) => {
      const products = [...prev.products];
      products[idx][name] = value;
      return { ...prev, products };
    });
  };

  const addProduct = () => {
    setReceipt((prev) => ({
      ...prev,
      products: [...prev.products, { ...defaultProduct }]
    }));
  };

  const removeProduct = (idx) => {
    setReceipt((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== idx)
    }));
  };

  const handleStatusChange = () => {
    if (status === "draft") setStatus("ready");
    else if (status === "ready") setStatus("done");
  };

  const handleValidate = () => {
    if (status === "ready") {
      setStatus("done");
      // TODO: Trigger backend update here (call onSave)
      if (onSave) onSave({ ...receipt, status: "done" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave({ ...receipt, status });
  };

  return (
    <div className="receipt-form-container">
      {/* Top action bar */}
      <div className="receipt-form-actions">
        <button type="button" className="btn" title="New receipt"
          onClick={() => setReceipt({ ...initialReceipt, responsible: user?.loginId || "" })}
        >
          <FiPlus /> New
        </button>
        <button type="button" className="btn" disabled={status === "done" || status === "draft"}
          onClick={handleValidate}
        >
          <FiCheckSquare /> Validate
        </button>
        <button type="button" className="btn" onClick={onPrint}>
          <FiPrinter /> Print
        </button>
        <button type="button" className="btn btn-cancel" onClick={onCancel}>
          <FiXCircle /> Cancel
        </button>
        <span className="receipt-status">
          Status: <b>{status.charAt(0).toUpperCase() + status.slice(1)}</b>
        </span>
        <span className="receipt-flow">
          Draft <span>&gt;</span> Ready <span>&gt;</span> Done
        </span>
        {status !== "done" &&
          <button type="button" className="btn btn-save" onClick={handleStatusChange}>
            <FiSave /> Mark as {status === "draft" ? "Ready" : "Done"}
          </button>
        }
      </div>
      {/* Receipt form */}
      <form className="receipt-form" onSubmit={handleSubmit}>
        <div className="form-group-row">
          <div className="form-group">
            <label>Receipt No.</label>
            <input
              name="receiptNumber"
              value={receipt.receiptNumber}
              onChange={handleChange}
              placeholder="WH/IN/0001"
              disabled={status !== "draft"}
              required
            />
          </div>
          <div className="form-group">
            <label>Schedule Date</label>
            <input
              name="scheduleDate"
              type="date"
              value={receipt.scheduleDate}
              onChange={handleChange}
              disabled={status === "done"}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Receive From</label>
          <input
            name="receiveFrom"
            value={receipt.receiveFrom}
            onChange={handleChange}
            disabled={status === "done"}
            placeholder="Supplier/Vendor"
            required
          />
        </div>
        <div className="form-group">
          <label>Responsible</label>
          <input
            name="responsible"
            value={receipt.responsible}
            disabled
            title="Auto-filled with logged-in user"
          />
        </div>
        <div className="products-section">
          <label>Products</label>
          <table className="products-table">
            <thead>
              <tr>
                <th>Product (SKU & Name)</th>
                <th>Quantity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {receipt.products.map((prod, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      name="sku"
                      value={prod.sku}
                      onChange={(e) => handleProductChange(idx, e)}
                      placeholder="SKU"
                      disabled={status === "done"}
                      style={{ width: "80px", marginRight: "6px" }}
                      required
                    />
                    <input
                      name="name"
                      value={prod.name}
                      onChange={(e) => handleProductChange(idx, e)}
                      placeholder="Name"
                      disabled={status === "done"}
                      required
                    />
                  </td>
                  <td>
                    <input
                      name="quantity"
                      type="number"
                      value={prod.quantity}
                      onChange={(e) => handleProductChange(idx, e)}
                      placeholder="0"
                      min={1}
                      disabled={status === "done"}
                      required
                      style={{ width: "70px" }}
                    />
                  </td>
                  <td>
                    {(receipt.products.length > 1 && status !== "done") && (
                      <button type="button" onClick={() => removeProduct(idx)} className="btn btn-mini btn-cancel">
                        <FiXCircle />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {status !== "done" && (
                <tr>
                  <td colSpan={3}>
                    <button type="button" className="btn btn-add" onClick={addProduct}>
                      <FiPlus /> Add New Product
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {status !== "done" && (
          <div className="form-actions">
            <button type="submit" className="btn btn-save" disabled={status === "done"}>Save</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReceiptForm;
