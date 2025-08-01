export default (sequelize, DataTypes) => {
  const Expense = sequelize.define("Expense", {
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "denied"),
      defaultValue: "pending",
    },
  });

  Expense.associate = (models) => {
    Expense.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Expense;
};
