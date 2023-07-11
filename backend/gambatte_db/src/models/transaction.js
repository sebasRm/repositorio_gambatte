const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction', {
    idtransaction: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    transactionType: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    transactionNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_login_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    buy_services_idbuy_services: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'buy_services',
        key: 'idbuy_services'
      }
    }
  }, {
    sequelize,
    tableName: 'transaction',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idtransaction" },
        ]
      },
      {
        name: "fk_transaction_user_login1_idx",
        using: "BTREE",
        fields: [
          { name: "user_login_id" },
        ]
      },
      {
        name: "fk_transaction_buy_services1_idx",
        using: "BTREE",
        fields: [
          { name: "buy_services_idbuy_services" },
        ]
      },
    ]
  });
};
