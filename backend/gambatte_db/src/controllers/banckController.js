const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;

/// singleton implementar

// organizar la ortografia en los comentarios
/// dioccionaro de mensajes y errores
let initModel = initModels(sequelize);

async function createBanck(req, res) {
  const { name } = req.body.data.banck;
  let banckExist = await initModel.bank.findAll({
    where: { name: name },
  });
  if (banckExist.length > 0) {
    return response(
      "Error el banco ya se encuentra registrado",
      400,
      res,
      false,
      []
    );
  } else {
    let banck = await initModel.bank.create({
      name: name,
    });

    return response("Banco registrado con exito", 201, res, "ok", banck);
  }
}


async function findBancks(req, res) {
    let banckExist = await initModel.bank.findAll({});
    if (banckExist.length > 0) {
      return  response(
        "Bancos registrados ....",
        201,
        res,
        "ok",
        banckExist
      );
    } else {
      return response("Error al buscar los bancos", 400, res, false, []);
    }
  }

  async function findBanckById(req, res) {
    const {id}= req.params
    let banckExist = await initModel.bank.findOne({where:{id:id}});
    if (banckExist) {
      return  response(
        "Bancos registrado ....",
        201,
        res,
        "ok",
        banckExist
      );
    } else {
      return response("Error al buscar los bancos", 400, res, false, []);
    }
  }


module.exports = {
  createBanck,
  findBancks
};
