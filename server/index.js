import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import models, { sequelize } from "./models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const { User, Expense } = models;

// Middleware
app.use(cors({ origin: /^http:\/\/localhost:\d+$/, credentials: true }));
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Create an expense
app.post("/expenses", async (req, res) => {
  try {
    const { amount, description, category, userId = 1 } = req.body;
    const newExpense = await Expense.create({
      amount,
      description,
      category,
      userId,
    });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all expenses
app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [{ model: User, attributes: ["name", "email", "role"] }],
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/deny an expense (role-based)
app.patch("/expenses/:id", async (req, res) => {
  try {
    const { status, userRole } = req.body;

    // Check if user has permission to update
    if (!userRole || (userRole !== "Director" && userRole !== "Exec")) {
      return res
        .status(403)
        .json({
          message: "Forbidden: Only Directors and Execs can update expenses.",
        });
    }

    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.status = status;
    await expense.save();

    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an expense (optional)
app.delete("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync DB and start server
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database error:", err);
  });
