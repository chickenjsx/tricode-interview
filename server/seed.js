import models, { sequelize } from "./models/index.js";

const { User, Expense } = models;

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    await sequelize.sync({ force: true });
    console.log("Database synced.");

    // Create sample users
    const users = await User.bulkCreate([
      { name: "John Doe", email: "john@example.com", role: "User" },
      { name: "Jane Smith", email: "jane@example.com", role: "Director" },
      { name: "Bob Johnson", email: "bob@example.com", role: "Exec" },
    ]);

    // Create sample expenses
    await Expense.bulkCreate([
      {
        amount: 85.5,
        description: "Client lunch meeting",
        category: "Meals",
        userId: users[0].id,
        status: "pending",
      },
      {
        amount: 250.0,
        description: "Flight to conference",
        category: "Travel",
        userId: users[0].id,
        status: "approved",
      },
      {
        amount: 45.99,
        description: "Office supplies",
        category: "Office",
        userId: users[1].id,
        status: "pending",
      },
      {
        amount: 120.0,
        description: "Software license",
        category: "Software",
        userId: users[2].id,
        status: "denied",
      },
    ]);

    console.log("Sample data created successfully!");
    console.log(`Created ${users.length} users and 4 expenses`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
