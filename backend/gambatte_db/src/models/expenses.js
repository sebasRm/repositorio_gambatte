const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('expenses', {
    idExpenses: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    expensesDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bank: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    keyAccount: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    swiftCode: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    account_idaccount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'idAccount'
      }
    }
  }, {
    sequelize,
    tableName: 'expenses',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idExpenses" },
        ]
      },
      {
        name: "fk_expenses_account1_idx",
        using: "BTREE",
        fields: [
          { name: "account_idaccount" },
        ]
      },
    ]
  });
};
