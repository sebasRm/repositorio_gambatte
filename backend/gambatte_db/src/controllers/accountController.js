const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);

/**
 * Función para consultar el abalance del usuario
 */
async function searchBalance(req, res) {
    const { userId } = req.params;
    try {
      const user = await initModel.user.findOne({
        where: { id: userId },
        include: [
          {
            model: initModel.account,
            as: "account_",
          },
        ],
        attributes:['id']
      });

      if (user) {
        let responses = response("balance...", 200, res, "ok", user);
        return responses;
      }
      let responses = response('Error al consultar el balance', 400, res, false, []);
      return responses;
    } catch (error) {
      console.log('Error al consultar el balance', error);
    }
  }
  

  module.exports = {
    searchBalance
  };
  