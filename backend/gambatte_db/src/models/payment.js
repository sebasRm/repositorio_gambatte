const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment', {
    idpayment: {
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
    tableName: 'payment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idpayment" },
        ]
      },
      {
        name: "fk_payment_buy_services1_idx",
        using: "BTREE",
        fields: [
          { name: "buy_services_idbuy_services" },
        ]
      },
    ]
  });
};
