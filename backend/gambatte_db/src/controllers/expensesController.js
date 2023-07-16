const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

async function findExpensesByUserId(req, res) {
    try {
      const { userId } = req.params;
      let user = await initModel.user.findOne({
        where:{
          id:userId
        }
      })
      if(user)
      {
        let expenses = await initModel.expenses.findAll({
          where: {
            account_idaccount: user.dataValues.account_idaccount,
          },
        });
        if (expenses) {
          let responses = response(
            "retiros del usuario",
            200,
            res,
            "ok",
            expenses
          );
          return responses;
      }
    
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

  async function findExpensesById(req, res) {
    try {
      const { idExpenses } = req.params;
 
        let expenses = await initModel.expenses.findOne({
          where: {
            idExpenses: idExpenses,
          },
        });
        if (expenses) {
          let responses = response(
            "retiro del usuario",
            200,
            res,
            "ok",
            expenses
          );
          return responses;
      
    
      } else {
        let responses = response(
          "Error al buscar los retiro",
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


  async function createExpenses(req, res) {
    try {
      const { id,idUser,fullName,email } = req.body.data.user;
      
      const {  bank, keyAccount, amount,swiftCode } = req.body.data.expenses;
     
      let user = await initModel.user.findOne({
        where:{id:id}
      })
      console.log(user)
      if(user){
        let expense = await initModel.expenses.create({
          amount:amount,
          expensesDate:Date.now(),
          bank:bank,
          keyAccount:keyAccount,
          swiftCode:swiftCode,
          account_idaccount: user.dataValues.account_idaccount,
      });

      if (expense) {
        let responses = response(
          "desositos del usuario",
          201,
          res,
          "ok",
          expense
        );
        return responses;
      }
    
      } else {
        let responses = response(
          "Error al crear los los retiro",
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
    findExpensesByUserId,
    createExpenses,
    findExpensesById
  };
  