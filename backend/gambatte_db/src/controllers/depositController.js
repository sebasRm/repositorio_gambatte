const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
import { getNotificationsUserDepositsExpenses } from "../socket/socket";

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

    for (let card in cards) {
      cardExits = await bcrypt.compare(
        req.cardInfo.cardNumber,
        cards[card].dataValues.cardNumber
      );
    }

    cardExits == false &&
      (await initModel.card.create({
        cardNumber: numberCard,
        cvv: ccvCard,
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

    let deposit = await initModel.deposit.create({
      amount: req.deposit.amount,
      depositDate: req.deposit.depositDate,
      ecommerce: req.deposit.ecommerce,
      state: req.deposit.state,
      account_idaccount: user.dataValues.account_idaccount,
    });
    let fullName = {
      fullName: req.user.fullName
    }
    user = await initModel.user.update(fullName, {
      where: { id: req.user.id },
    });

    user = await initModel.user.findOne({
      where: { id: req.user.id },
    });
    delete user.dataValues.password

    if (deposit) {
      let responses
      await getNotificationsUserDepositsExpenses()
      responses = response("Depósito creado con exito", 201, res, "ok", { deposit: deposit, user: user.dataValues });

      return responses
    } else {
      return response("Error al crear el depósito", 400, res, "false", []);
    }
  } catch (error) {
    throw error;
  }
}

async function findAllDeposits(req, res) {
  try {
    let deposits = await initModel.deposit.findAll({});
    if (deposits) {
      let responses = response("retiros del usuario", 200, res, "ok", deposits);
      return responses;
    } else {
      let responses = response(
        "Error al buscar los retiros",
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

async function findDepositByIdUser(req, res) {
  try {
    const { userId } = req.params;

    let user = await initModel.user.findOne({
      where: {
        id: userId,
      },
    });

    let deposits = await initModel.deposit.findAll({
      where: {
        account_idaccount: user.dataValues.account_idaccount,
        //date: { [Op.startsWith]: despositDate },
      },
    });
    if (deposits) {
      let responses
      setTimeout(() => {
        responses = response(
          "Desósitos del usuario",
          200,
          res,
          "ok",
          deposits
        );
      }, 1000);


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
    throw error;
  }
}

async function findDepositById(req, res) {
  try {
    const { idDeposit } = req.params;

    let deposits = await initModel.deposit.findOne({
      where: {
        idDeposit: idDeposit
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
    throw error;
  }
}


export {
  createDeposit,
  findAllDeposits,
  findDepositByIdUser,
  findDepositById,
};
