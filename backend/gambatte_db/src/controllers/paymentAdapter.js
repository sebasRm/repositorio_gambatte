import { findUserByIdService, findUsersServices } from "../services/userService";

const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);

async function createPayment(req, res) {
  try {
    let statusFalse = 0;
    let statusActive = 0;
    let balanceTotal;
    let updateBalance;
    let userUpdate;
    let count = 0;
    req = req.body.data.earningPayment;
    let actives = req.actives;
    let user = await initModel.user.findOne({
      where: { id: req.clientId },
      include: [
        {
          model: initModel.account,
          as: "account_",
        },
      ],
    });
    if (user) {
      for (let active in actives) {
        let data_actives = actives[active];
        await initModel.payment.create({
          title: data_actives.title,
          price: data_actives.price,
          percentage: data_actives.price_movement.percentage,
          value: data_actives.price_movement.value,
          movement: data_actives.price_movement.movement,
          investmentValue: data_actives.payment.investmentValue,
          date: data_actives.payment.date,
          hour: data_actives.payment.hour,
          result: data_actives.payment.result,
          total: data_actives.payment.total,
          status: data_actives.payment.status,
          account_idAccount: user.dataValues.account_idaccount,
        });
        let status = data_actives.payment.status;
        if (status == false) {
          statusFalse += data_actives.payment.investmentValue;
        } else {
          statusActive += data_actives.payment.total;
        }
        count++;
        if (count == actives.length) {
          break;
        }
      }
      if (statusFalse > statusActive) {
        balanceTotal = statusFalse - statusActive;
        let total = {
          balance: user.dataValues.account_.balance - balanceTotal,
        };
        updateBalance = await initModel.account.update(total, {
          where: { idAccount: user.dataValues.account_idaccount },
        });
      } else {
        balanceTotal = statusActive + statusFalse;
        let total = {
          balance: user.dataValues.account_.balance + balanceTotal,
        };
        updateBalance = await initModel.account.update(total, {
          where: { idAccount: user.dataValues.account_idaccount },
        });
      }
      if (updateBalance) {
        userUpdate = await initModel.user.findOne({
          where: { id: req.clientId },
          include: [
            {
              model: initModel.account,
              as: "account_",
              include: [
                {
                  model: initModel.payment,
                  as: "payments",
                }
              ]
            },
          ],
          attributes: { exclude: ['password'] }
        });
      }
      if (userUpdate) {
        return response(
          "activos registrados existosamente",
          201,
          res,
          "ok",
          userUpdate
        );
      } else {
        return response("error al crear los activos", 400, res, "false", []);
      }
    } else {
      return response("error usuario no encontrado ", 400, res, "false", []);
    }
  } catch (error) {
    console.log(error);
    return response("Lo sentimos ha ocurrido un error interno ", 500, res, "false", []);
  }
}

async function findAllPayments(req, res) {
  try {
    let payments = await findUsersServices()
    if (payments) {
      return response("Pagos y ganancias", 200, res, "ok", payments);
    } else {
      return response(
        "Error al buscar los pagos y ganancias",
        400,
        res,
        "false",
        []
      );
    }
  } catch (error) {
    return response("Lo sentimos ha ocurrido un error interno ", 500, res, "false", []);
  }
}

async function findAllPaymentsById(req, res) {
  try {
    let payments = await initModel.payment.findAll({});
    if (payments) {
      return response("Pagos y ganancias", 200, res, "ok", payments);
    } else {
      return response(
        "Error al buscar los pagos y ganancias",
        400,
        res,
        "false",
        []
      );
    }
  } catch (error) {
    return response("Lo sentimos ha ocurrido un error interno ", 500, res, "false", []);
  }
}

export { createPayment, findAllPayments };
