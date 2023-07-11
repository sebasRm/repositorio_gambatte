const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('expenses', {
    idexpenses: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
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
        key: 'idaccount'
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
          { name: "idexpenses" },
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
