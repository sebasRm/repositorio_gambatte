const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");

async function notificationsUsers() {
  let userNotificatios = await initModel.user.findAll({
    include: [
      {
        model: initModel.account,
        as: "account_",
        include: [
          {
            model: initModel.deposit,
            as: "deposits",
            attributes: [
                  'idDeposit',
                 //
                 // [sequelize.fn('COUNT', sequelize.col('idDeposit')), 'deposits']
                  

                ],
                group:['deposit.idDeposit'],
          },
          {
            model: initModel.expenses,
            as: "expenses",
      
          },
        ],
      },
    ],
  });
  if (userNotificatios.length > 0) {
    //[0].dataValues.account_.dataValues.deposits[0].dataValues
    console.log("userNotificatios", userNotificatios)
    //return response("Notifications users...", 200, res, "ok", userNotificatios);
  } else {
   // return response("Error get notifications users ...", 400, res, "false", []);
  }
}


async function createDeposit(deposits) {
  let cards;
  let user;
  let cardExits = false;
  try {
    console.log("deposit", deposits)
    let req = deposits.data;

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
    let fullName ={
      fullName: req.user.fullName
    }
    user = await initModel.user.update(fullName,{
      where: { id: req.user.id },
    });

    user = await initModel.user.findOne({
      where: { id: req.user.id },
    });
    delete user.dataValues.password

    if (deposit) {
    return deposit
  }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  notificationsUsers,
  createDeposit
};
