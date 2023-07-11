var DataTypes = require("sequelize").DataTypes;
var _account = require("./account");
var _buy_services = require("./buy_services");
var _card = require("./card");
var _deposit = require("./deposit");
var _document_type = require("./document_type");
var _expenses = require("./expenses");
var _payment = require("./payment");
var _rol = require("./rol");
var _transaction = require("./transaction");
var _user = require("./user");

function initModels(sequelize) {
  var account = _account(sequelize, DataTypes);
  var buy_services = _buy_services(sequelize, DataTypes);
  var card = _card(sequelize, DataTypes);
  var deposit = _deposit(sequelize, DataTypes);
  var document_type = _document_type(sequelize, DataTypes);
  var expenses = _expenses(sequelize, DataTypes);
  var payment = _payment(sequelize, DataTypes);
  var rol = _rol(sequelize, DataTypes);
  var transaction = _transaction(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  deposit.belongsTo(account, { as: "account_", foreignKey: "account_idaccount"});
  account.hasMany(deposit, { as: "deposits", foreignKey: "account_idaccount"});
  expenses.belongsTo(account, { as: "account_", foreignKey: "account_idaccount"});
  account.hasMany(expenses, { as: "expenses", foreignKey: "account_idaccount"});
  user.belongsTo(account, { as: "account_", foreignKey: "account_idaccount"});
  account.hasMany(user, { as: "users", foreignKey: "account_idaccount"});
  payment.belongsTo(buy_services, { as: "buy_", foreignKey: "buy_services_idbuy_services"});
  buy_services.hasMany(payment, { as: "payments", foreignKey: "buy_services_idbuy_services"});
  transaction.belongsTo(buy_services, { as: "buy_", foreignKey: "buy_services_idbuy_services"});
  buy_services.hasMany(transaction, { as: "transactions", foreignKey: "buy_services_idbuy_services"});
  user.belongsTo(document_type, { as: "document_", foreignKey: "document_type_iddocument_type"});
  document_type.hasMany(user, { as: "users", foreignKey: "document_type_iddocument_type"});
  user.belongsTo(rol, { as: "rol_", foreignKey: "rol_idrol"});
  rol.hasMany(user, { as: "users", foreignKey: "rol_idrol"});
  buy_services.belongsTo(user, { as: "user_", foreignKey: "user_login_id"});
  user.hasMany(buy_services, { as: "buy_services", foreignKey: "user_login_id"});
  card.belongsTo(user, { as: "user_", foreignKey: "user_login_id"});
  user.hasMany(card, { as: "cards", foreignKey: "user_login_id"});
  transaction.belongsTo(user, { as: "user_", foreignKey: "user_login_id"});
  user.hasMany(transaction, { as: "transactions", foreignKey: "user_login_id"});

  return {
    account,
    buy_services,
    card,
    deposit,
    document_type,
    expenses,
    payment,
    rol,
    transaction,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
