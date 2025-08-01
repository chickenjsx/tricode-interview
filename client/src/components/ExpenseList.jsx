const API_BASE = "http://localhost:3001";

function ExpenseList({ expenses, currentRole, onExpenseUpdated }) {
  const canApprove = currentRole === "Director" || currentRole === "Exec";

  const updateExpenseStatus = async (expenseId, status) => {
    try {
      const response = await fetch(`${API_BASE}/expenses/${expenseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          userRole: currentRole,
        }),
      });

      if (response.ok) {
        const updatedExpense = await response.json();
        onExpenseUpdated(updatedExpense);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Error updating expense");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#4CAF50";
      case "denied":
        return "#f44336";
      case "pending":
        return "#ff9800";
      default:
        return "#666";
    }
  };

  return (
    <div className="expense-list">
      <h2>All Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <div className="expenses">
          {expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="expense-info">
                <h3>${expense.amount.toFixed(2)}</h3>
                <p>
                  <strong>Description:</strong> {expense.description}
                </p>
                <p>
                  <strong>Category:</strong> {expense.category}
                </p>
                <p>
                  <strong>Submitted by:</strong>{" "}
                  {expense.User?.name || "Unknown"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: getStatusColor(expense.status) }}>
                    {expense.status.toUpperCase()}
                  </span>
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(expense.createdAt).toLocaleDateString()}
                </p>
              </div>

              {canApprove && expense.status === "pending" && (
                <div className="expense-actions">
                  <button
                    className="approve-btn"
                    onClick={() => updateExpenseStatus(expense.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="deny-btn"
                    onClick={() => updateExpenseStatus(expense.id, "denied")}
                  >
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
