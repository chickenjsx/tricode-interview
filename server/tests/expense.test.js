import request from "supertest";
import express from "express";
import cors from "cors";
import models, { sequelize } from "../models/index.js";

const app = express();
const { User, Expense } = models;

// Middleware
app.use(cors({ origin: /^http:\/\/localhost:\d+$/, credentials: true }));
app.use(express.json());

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

describe("Expense API", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    // Create a test user
    await User.create({
      name: "Test User",
      email: "test@example.com",
      role: "User",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Expense.destroy({ where: {} });
  });

  describe("POST /expenses", () => {
    it("should create a new expense", async () => {
      const expenseData = {
        amount: 100.5,
        description: "Office supplies",
        category: "Office",
        userId: 1,
      };

      const response = await request(app)
        .post("/expenses")
        .send(expenseData)
        .expect(201);

      expect(response.body).toMatchObject({
        amount: 100.5,
        description: "Office supplies",
        category: "Office",
        status: "pending",
      });
    });

    it("should return error for invalid expense data", async () => {
      const expenseData = {
        // missing required fields
        description: "Office supplies",
      };

      await request(app).post("/expenses").send(expenseData).expect(400);
    });
  });

  describe("PATCH /expenses/:id", () => {
    let expenseId;

    beforeEach(async () => {
      const expense = await Expense.create({
        amount: 100,
        description: "Test expense",
        category: "Test",
        userId: 1,
      });
      expenseId = expense.id;
    });

    it("should approve an expense with Director role", async () => {
      const response = await request(app)
        .patch(`/expenses/${expenseId}`)
        .send({
          status: "approved",
          userRole: "Director",
        })
        .expect(200);

      expect(response.body.status).toBe("approved");
    });

    it("should approve an expense with Exec role", async () => {
      const response = await request(app)
        .patch(`/expenses/${expenseId}`)
        .send({
          status: "approved",
          userRole: "Exec",
        })
        .expect(200);

      expect(response.body.status).toBe("approved");
    });

    it("should deny access for User role", async () => {
      await request(app)
        .patch(`/expenses/${expenseId}`)
        .send({
          status: "approved",
          userRole: "User",
        })
        .expect(403);
    });

    it("should return 404 for non-existent expense", async () => {
      await request(app)
        .patch("/expenses/999")
        .send({
          status: "approved",
          userRole: "Director",
        })
        .expect(404);
    });
  });

  describe("GET /expenses", () => {
    beforeEach(async () => {
      await Expense.create({
        amount: 100,
        description: "Test expense 1",
        category: "Test",
        userId: 1,
      });
      await Expense.create({
        amount: 200,
        description: "Test expense 2",
        category: "Test",
        userId: 1,
      });
    });

    it("should return all expenses", async () => {
      const response = await request(app).get("/expenses").expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty("User");
    });
  });
});
