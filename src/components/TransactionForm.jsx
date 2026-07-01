import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

/**
 * TransactionForm - Left column input form
 * Allows users to add new transactions with all required fields
 * Optimized with React.memo and useCallback for event handlers
 */
const TransactionForm = React.memo(function TransactionForm({
  onAddTransaction,
  categories,
}) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0], // Default to today
  });

  // Memoize event handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleTypeChange = useCallback((type) => {
    setFormData((prev) => ({ ...prev, type }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!formData.title || !formData.amount) {
        alert("Please fill in all required fields");
        return;
      }

      const transaction = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
        timestamp: new Date().toISOString(),
      };

      onAddTransaction(transaction);

      // Reset form
      setFormData({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
    },
    [formData, onAddTransaction]
  );

  return (
    <div className="transaction-form">
      <h2 className="form-title">Add Transaction</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title / Description *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Grocery shopping"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type *</label>
          <div className="type-selector">
            <button
              type="button"
              className={`type-btn ${
                formData.type === "expense" ? "active" : ""
              }`}
              onClick={() => handleTypeChange("expense")}
            >
              Expense
            </button>
            <button
              type="button"
              className={`type-btn ${
                formData.type === "income" ? "active" : ""
              }`}
              onClick={() => handleTypeChange("income")}
            >
              Income
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category (optional)</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Add Transaction
        </button>
      </form>
    </div>
  );
});

TransactionForm.propTypes = {
  onAddTransaction: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TransactionForm;
