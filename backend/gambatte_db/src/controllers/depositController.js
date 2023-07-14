const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

/**
 * Funcion para crear un deposito de un usuario
 */

async function createDeposit(req, res) {
  let cards;
  let user;
  let cardExits = false;
  try {
    req = req.body.data;

    cards = await initModel.card.findAll({
      where: { user_login_id: req.user.id },
    });

    const numberCard = await bcrypt.hash(req.cardInfo.cardNumber, 10);
    const ccvCard = await bcrypt.hash(req.cardInfo.ccv, 10);
    const yearCard = await bcrypt.hash(req.cardInfo.expYear, 10);
    const monthCard = await bcrypt.hash(req.cardInfo.month, 10);

    for (card in cards) {
      cardExits = await bcrypt.compare(
        req.cardInfo.cardNumber,
        cards[card].dataValues.cardNumber
      );
    }

    cardExits == false &&
      (await initModel.card.create({
        cardNumber: numberCard,
        ccv: ccvCard,
        expYear: yearCard,
        month: monthCard,
        termAndConditions: req.cardInfo.termAndConditions,
        user_login_id: req.user.id,
      }));

   // let testCard = cards.map(async(card)=>{return cardExits = await bcrypt.compare(req.cardInfo.cardNumber, card.dataValues.cardNumber)})
    //  console.log("testCard", testCard)
    user = await initModel.user.findOne({
      where: { id: req.user.id },
    });

    cards = await initModel.deposit.create({
      amount: req.deposit.amount,
      depositDate: req.deposit.depositDate,
      ecommerce: req.deposit.ecommerce,
      state: req.deposit.state,
      account_idaccount: user.dataValues.account_idaccount,
    });
    if (cards) {
      return response("Depósito creado con exito", 201, res, "ok", cards);
    } else {
      return response("Error al crear el depósito", 400, res, "false", []);
    }
  } catch (error) {
    console.log(error);
  }
}

async function findDepositByIdUser(req, res) {
  try {
    const { userId } = req.params;

    let user = await initModel.user.findOne({
      where: {
        id: userId , 
      },
    });

    let deposits = await initModel.deposit.findAll({
      where: {
        account_idaccount: user.dataValues.account_idaccount,
        //date: { [Op.startsWith]: despositDate },
      },
    });
    if (deposits) {
      let responses = response(
        "Desósitos del usuario",
        200,
        res,
        "ok",
        deposits
      );
      return responses;
    } else {
      let responses = response(
        "Error al buscar los depósitos",
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

async function findDepositById(req, res) {
  try {
    const { idDeposit } = req.params;

    let deposits = await initModel.deposit.findOne({
      where: {
        idDeposit:idDeposit
      },
    });

    if (deposits) {
      let responses = response(
        "Desósito del usuario",
        200,
        res,
        "ok",
        deposits
      );
      return responses;
    } else {
      let responses = response(
        "Error al buscar el depósito",
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
  createDeposit,
  findDepositByIdUser,
  findDepositById
};
