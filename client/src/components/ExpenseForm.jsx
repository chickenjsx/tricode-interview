import { useState } from "react";

const API_BASE = "http://localhost:3001";

function ExpenseForm({ onExpenseCreated }) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        const newExpense = await response.json();
        onExpenseCreated(newExpense);
        setFormData({ amount: "", description: "", category: "" });
      } else {
        console.error("Failed to create expense");
      }
    } catch (error) {
      console.error("Error creating expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="expense-form">
      <h2>Create New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Travel">Travel</option>
            <option value="Meals">Meals</option>
            <option value="Office">Office Supplies</option>
            <option value="Software">Software</option>
            <option value="Equipment">Equipment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Expense"}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
