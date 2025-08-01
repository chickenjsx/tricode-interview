import express from "express";
import cors from "cors";
import models, { sequelize } from "./models/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: /^http:\/\/localhost:\d+$/, credentials: true }));
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Sync DB and start server
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
    return sequelize.sync({ alter: true }); // or { force: true } to reset tables
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database error:", err);
  });
