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

    //cards.map(async(card)=>{ cardExits = await bcrypt.compare(req[0].cardInfo.cardNumber, card.dataValues.cardNumber)})

    user = await initModel.user.findOne({
      where: { id: req.user.id },
    });

    cards = await initModel.deposit.create({
      amount: req.deposit.amount,
      date: req.deposit.depositDate,
      ecommerce: req.deposit.ecommerce,
      status: req.deposit.state,
      account_idaccount: user.dataValues.account_idaccount,
    });
    if (cards) {
      return response("Deposito creado con exito", 201, res, "ok", []);
    } else {
      return response("Error al crear el deposito", 400, res, "false", []);
    }
  } catch (error) {
    console.log(error);
  }
}

async function searchDeposit(req, res) {
  try {
    const { account_idaccount, despositDate } = req.query;
    let deposits = await initModel.deposit.findAll({
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
  createDeposit,
  searchDeposit,
};
