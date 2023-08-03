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
        200,
        res,
        "ok",
        banckExist
      );
    } else {
      return response("Error al buscar los bancos", 400, res, false, []);
    }
  }

  async function findBanckById(req, res) {
    const {idBanck}= req.params
    let banckExist = await initModel.bank.findOne({where:{idBanck:idBanck}});
    if (banckExist) {
      return  response(
        "Banco registrado ....",
        200,
        res,
        "ok",
        banckExist
      );
    } else {
      return response("Error al buscar los bancos", 400, res, false, []);
    }
  }

  async function updateBanck(req, res) {
    const {idBanck}= req.params
    const { name } = req.body.data.banck;
    let data = {
        name: name
    }
    let banckExist = await initModel.bank.update(data,{where:{idBanck:idBanck}});
    if (banckExist) {
    let banck = await initModel.bank.findOne({where:{idBanck:idBanck}});
      return  response(
        "banco actualizado con exito",
        200,
        res,
        "ok",
        banck
      );
    } else {
      return response("Error al actualizar el banco", 400, res, false, []);
    }
  }


  async function deleteBanck(req, res) {
    const {idBanck}= req.params
    let banckExist = await initModel.bank.destroy({where:{idBanck:idBanck}});
    if (banckExist ==1) {
    let banck = await initModel.bank.findOne({where:{idBanck:idBanck}});
      return  response(
        "banco eliminado con exito",
        200,
        res,
        "ok",
        []
      );
    } else {
      return response("Error al eliminar el banco", 400, res, false, []);
    }
  }  


module.exports = {
  createBanck,
  findBancks,
  findBanckById,
  updateBanck,
  deleteBanck
  
};
