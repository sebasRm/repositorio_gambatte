const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
import { emitNotificationCreationDepositExpenses, getNotificationsUserDepositsExpenses, getNotificationsUserDepositsExpenses1 } from "../socket/socket";
import { generateCardToken } from "../helpers/utils";
import { verifyTokenCard } from "../middleware/verfyOauth";
import deposit from "../models/deposit";

/**
 * Funcion para crear un deposito de un usuario
 */

async function createDeposit(req, res) {
  let cards;
  let user;
  let cardExits = false;
  let cardCreate;
  let findCard;
  let idCard
  // console.log('data ================ >', req.body.data);
  let { user: userReq, cardInfo, deposit } = req.body.data

  // console.log('userReq ================ >', userReq.id);

  try {
    req = req.body.data;
    let cardUser = req.cardInfo;
    cards = await initModel.card.findAll({
      where: { user_login_id: userReq.id },
    });

    let cardToken = generateCardToken(cardInfo.cardNumber)
    let cvvToken = generateCardToken(cardInfo.ccv)
    let expYearToken = generateCardToken(cardInfo.expYear)
    let monthToken = generateCardToken(cardInfo.month)

    if (cards.length > 0) {
      for (let card in cards) {
        let tokenCard = cards[card]
        // console.log(tokenCard.dataValues);
        let token = await verifyTokenCard(tokenCard?.dataValues?.cardNumber)
        if (cardInfo.cardNumber === token) {
          idCard = tokenCard.dataValues.idCard
        }
      }
    }

    else {
      cardCreate = await initModel.card.create({
        user_login_id: userReq.id,
        cardNumber: cardToken,
        cvv: cvvToken,
        expYear: expYearToken,
        month: monthToken,
        termAndConditions: cardUser.termAndConditions
      })
    }
    /* cardExits === false ?
       cardCreate=await initModel.card.create({
         user_login_id: req.user.id,
         cardToken: cardToken
       }): cardCreate=await initModel.card.findOne({where:{cardToken: cardToken}})*/

    if (cardCreate) {
      findCard = cardCreate
      console.log('Mostrando los datos de la creacion tarjeta :', cardCreate, findCard);
      // findCard = await initModel.card.findOne({
      //   where: { user_login_id: userReq.id },
      // });
    }
    //console.log("cardCreate", cardCreate)

    user = await initModel.user.findOne({
      where: { id: userReq.id },
    });

    let createDeposit = await initModel.deposit.create({
      amount: deposit.amount,
      depositDate: deposit.depositDate,
      ecommerce: deposit.ecommerce,
      state: deposit.state,
      account_idaccount: user.dataValues.account_idaccount,
      idCard: idCard ? idCard : findCard.dataValues.idCard
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

    if (createDeposit) {
      let responses
      await getNotificationsUserDepositsExpenses1()
      await emitNotificationCreationDepositExpenses(`${req.user.fullName} ha solicitado un depósito.`)
      responses = response("Depósito creado con exito", 201, res, "ok", { deposit: createDeposit, user: user.dataValues });

      return responses
    } else {
      return response("Error al crear el depósito", 400, res, "false", []);
    }
  } catch (error) {
    console.log(error);
    return response("Error al crear el depósito", 400, res, "false", []);
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
