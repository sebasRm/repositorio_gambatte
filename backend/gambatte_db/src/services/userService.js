const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");

let { initModel } = require('../helpers/utils')


const findUserByIdService = async (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await initModel.user.findOne({
                where: { id: idUser },
            });
            if (user) {
                delete user.dataValues.password
                return resolve(user)
            }
            reject(false)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    findUserByIdService
}