const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('card', {
    idcard: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cardNumber: {
      type: DataTypes.STRING(600),
      allowNull: true
    },
    ccv: {
      type: DataTypes.STRING(600),
      allowNull: true
    },
    expYear: {
      type: DataTypes.STRING(600),
      allowNull: true
    },
    month: {
      type: DataTypes.STRING(600),
      allowNull: true
    },
    termAndConditions: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    user_login_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'card',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idcard" },
        ]
      },
      {
        name: "fk_card_user_login1_idx",
        using: "BTREE",
        fields: [
          { name: "user_login_id" },
        ]
      },
    ]
  });
};
