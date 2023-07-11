const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_login', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idUser: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    fullName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    secondName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    documentNumber: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    statusActive: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    rol_idrol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rol',
        key: 'idrol'
      }
    },
    account_idaccount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'idaccount'
      }
    },
    termsAndConditions: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    registerStatus: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    document_type_iddocument_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'document_type',
        key: 'iddocument_type'
      }
    }
  }, {
    sequelize,
    tableName: 'user_login',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_user_login_rol_idx",
        using: "BTREE",
        fields: [
          { name: "rol_idrol" },
        ]
      },
      {
        name: "fk_user_login_account1_idx",
        using: "BTREE",
        fields: [
          { name: "account_idaccount" },
        ]
      },
      {
        name: "fk_user_login_document_type1_idx",
        using: "BTREE",
        fields: [
          { name: "document_type_iddocument_type" },
        ]
      },
    ]
  });
};
