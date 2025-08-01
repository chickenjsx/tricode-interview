export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("User", "Director", "Exec"),
      defaultValue: "User",
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Expense, { foreignKey: "userId" });
  };

  return User;
};
