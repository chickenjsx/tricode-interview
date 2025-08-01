import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import UserModel from "./user.js";
import ExpenseModel from "./expense.js";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB_NAME || "interview",
  username: process.env.DB_USER || "chicken",
  password: process.env.DB_PASSWORD || "chicken",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3300,
});

const models = {
  User: UserModel(sequelize, DataTypes),
  Expense: ExpenseModel(sequelize, DataTypes),
};

Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

export { sequelize };
export default models;
