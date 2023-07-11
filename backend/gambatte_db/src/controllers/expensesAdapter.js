const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

async function searchExpenses(req, res) {
    try {
      const { account_idaccount, despositDate } = req.query;
      let deposits = await initModel.expenses.findAll({
        where: {
          account_idaccount: account_idaccount,
          date: { [Op.startsWith]: despositDate },
        },
      });
      if (deposits) {
        let responses = response(
          "desositos del usuario",
          201,
          res,
          "ok",
          deposits
        );
        return responses;
      } else {
        let responses = response(
          "Error al buscar los depositos",
          400,
          res,
          "false",
          []
        );
        return responses;
      }
    } catch (error) {
      console.log(error);
    }
  }

  module.exports = {
    searchExpenses,
  };
  