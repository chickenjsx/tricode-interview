import express from "express";
import cors from "cors";
import models, { sequelize } from "./models/index.js";

const app = express();
const PORT = process.env.PORT || 3000;
const { User, Expense } = models;

// Middleware
app.use(cors({ origin: /^http:\/\/localhost:\d+$/, credentials: true }));
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.post("/new-expense", async (req, res) =>{
  const newExpense = Expense.create(req.body)
  console.log(newExpense.toJSON());
  res.status(200).json({ message: "Expense created successfully!" });
});

app.put("/update-expense/", async (req, res) => {
  const user = req.body.user;
  if(!user.role || user.role !== "Director" || !user.role == "Exec") {
    return res.status(403).json({ message: "Forbidden: Only admins can update expenses." });
  }

  const expenseId = req.body.expenseId;
  
})

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
