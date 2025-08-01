import { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import RoleSwitcher from "./components/RoleSwitcher";
import "./App.css";

const API_BASE = "http://localhost:3001";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [currentRole, setCurrentRole] = useState("User");
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/expenses`);
      const data = await response.json();
      setExpenses(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setLoading(false);
    }
  };

  const handleExpenseCreated = (newExpense) => {
    setExpenses((prev) => [...prev, newExpense]);
  };

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="app">
      <h1>Expense Management System</h1>

      <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />

      <div className="app-content">
        <div className="left-panel">
          <ExpenseForm onExpenseCreated={handleExpenseCreated} />
        </div>

        <div className="right-panel">
          {loading ? (
            <p>Loading expenses...</p>
          ) : (
            <ExpenseList
              expenses={expenses}
              currentRole={currentRole}
              onExpenseUpdated={handleExpenseUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
