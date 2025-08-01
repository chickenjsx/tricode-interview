import { Sequelize, DataTypes } from "sequelize";
import UserModel from "./user.js";
import ExpenseModel from "./expense.js";

const sequelize = new Sequelize({
  dialect: "mysql",
  database: "interview",
  username: "chicken",
  password: "chicken",
  host: "localhost",
  port: 3300,
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
