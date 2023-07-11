const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const STATICVAR = require("../helpers/utils").staticVar;
const response = require("../helpers/utils").response;
const randomIdUser = require("../helpers/utils").generateRandomIdUser;
const { generateToken } = require("../helpers/utils");
/// singleton implementar

/// dioccionaro de mensajes y errores
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
let port = process.env.PORT;
let host = process.env.HOST_URL;
let server = process.env.SERVER_URL;
/**
 * Función para crear un usuario.
 */

async function createUser(req, res) {
  let user;
  let userExist;
  let idUserExist;
  req = req.body.data;
  try {
    let idUser = randomIdUser(8);
    idUserExist = await initModel.user.findAll({
      where: {
        idUser: idUser,
      },
    });
    if (idUserExist.length == 0) {
      userExist = await initModel.user.findAll({
        where: {
          email: req.user.email,
        },
      });
      if (userExist.length == 0) {
        const password = await bcrypt.hash(req.user.password, 10);
        account = await initModel.account.create({});
        userCreate = await initModel.user.create({
          idUser: idUser,
          fullName: req.user.fullName,
          email: req.user.email,
          phone: req.user.phone,
          password: password,
          rol_idrol: 2,
          account_idaccount: account.dataValues.idaccount,
          termsAndConditions: req.user.termAndConditions,
          registerStatus: true,
          status: false,
          finishRegister: false,
        });
        user = await initModel.user.findAll({
          where: {
            id: userCreate.dataValues.id,
          },
          include: [
            {
              model: initModel.rol,
              as: "rol_",
            },
          ],
        });
        console.log("user", user);
        delete user[0].dataValues.password;
        if (user) {
          let responses = response(
            STATICVAR.USER_REGISTER_SUCCESSFUL,
            201,
            res,
            "ok",
            user
          );
          return responses;
        }
      } else if (userExist) {
        let responses = response(
          STATICVAR.USER_REGISTER_EXIST,
          400,
          res,
          "false",
          []
        );
        return responses;
      } else {
        let responses = response(
          STATICVAR.USER_REGISTER_ERROR,
          400,
          res,
          "false",
          []
        );
        return responses;
      }
    } else {
      createUser(req, res);
    }
  } catch (error) {
    console.log(STATICVAR.USER_CREATE_ERROR, error);
  }
}

/**
 * Función para consultar si el usuario que se esta logeando existe
 * en la base de datos y si coinciden los datos de entrada.
 */
async function userLogin(req, res) {
  req = req.body.data.user;
  const { password } = req;
  try {
    let user = await initModel.user.findOne({
      where: { email: req.email },
      include: [
        {
          model: initModel.rol,
          as: "rol_",
        },
      ],
      attributes: [
        "id",
        "idUser",
        "fullName",
        "email",
        "avatar",
        "termsAndConditions",
        "finishRegister",
        "password",
      ],
    });
    if (user) {
      const login = await bcrypt.compare(password, user.dataValues.password);
      delete user.dataValues.password;
      if (login) {
        user.dataValues.role = user.dataValues.rol_.dataValues.role;
        delete user.dataValues.rol_

        const dataUser = {
          user: user,
          accessToken: generateToken(user),
        };
        let responses = response(
          "Usuario logeado...",
          200,
          res,
          "ok",
          dataUser
        );
        return responses;
      }
      let responses = response(STATICVAR.user_ERROR, 400, res, false, []);
      return responses;
    } else {
      let responses = response(
        "El usuario no se encuentra registrado",
        400,
        res,
        false,
        []
      );
      return responses;
    }
  } catch (error) {
    console.log(STATICVAR.user_ERROR_METHOD, error);
  }
}

/**
 * Función para consultar si el usuario que se esta logeando existe
 * en la base de datos y si coinciden los datos de entrada.
 */
async function userLogout(req, res) {
  req = req.body.data.user;
  try {
    let status = {
      statusActive: false,
    };
    let userOut = await initModel.user.update(status, {
      where: { id: req.id },
    });
    if (userOut) {
      let responses = response(STATICVAR.USER_LOGOUT, 200, res, "ok", []);
      return responses;
    }
    let responses = response(STATICVAR.user_ERROR, 400, res, false, []);
    return responses;
  } catch (error) {
    console.log(STATICVAR.USER_LOGOUT_ERROR_METHOD, error);
  }
}

/**
 * Función para eliminar un usuario
 */

async function deleteUserLogin(req, res) {
  try {
    req = req.query;
    const user = await initModel.user.destroy({
      where: { id: req.id },
    });
    if (user == 1) {
      let responses = response(
        STATICVAR.USER_DELETED_SUCCESSFUL,
        200,
        res,
        "ok",
        []
      );
      return responses;
    } else {
      let responses = response(
        STATICVAR.USER_DELETED_ERROR,
        400,
        res,
        false,
        []
      );
      return responses;
    }
  } catch (error) {
    console.log(STATICVAR.USER_DELETE_USER_ERROR_METHOD, error);
  }
}

/**
 * Función para actualizar la contraseña de un usuario
 */

async function updatePasswordUserLogin(req, res) {
  req = req.body.data;
  try {
    const passwordNew = await bcrypt.hash(req.user.password, 10);
    let password = {
      password: passwordNew,
    };
    const user = await initModel.user.update(password, {
      where: { id: req.user.id },
    });
    if (user[0] == "1") {
      let responses = response(
        STATICVAR.USER_UPDATE_SUCCESSFUL,
        200,
        res,
        "ok",
        []
      );
      return responses;
    }
    let responses = response(STATICVAR.USER_UPDATE_ERROR, 400, res, false, []);
    return responses;
  } catch (error) {
    console.log(STATICVAR.USER_UPDATE_ERROR_METHOD, error);
  }
}

/**
 * Función para actualizar la imagen  de un usuario
 */
//// validar extenciones de imagenes
/// optimización de img
//// obtener img ruta
async function updateAvatarUserLogin(req, res) {
  try {
    if (req.file) {
      const userAvatarBD = await initModel.user.findOne({
        where: { id: req.query.id },
      });
      let deleteAvatar = userAvatarBD.dataValues.avatar;
      if (deleteAvatar) {
        deleteAvatar = deleteAvatar.split("/");
        deleteAvatar = deleteAvatar[deleteAvatar.length - 1];
        fs.unlinkSync(server + deleteAvatar);
      }
      const { filename } = req.file;
      let avatar = {
        avatar: server + filename,
      };
      const user = await initModel.user.update(avatar, {
        where: { id: req.query.id },
      });
      if (user[0] == "1") {
        let responses = response(
          STATICVAR.USER_UPDATE_AVATAR_SUCCESSFUL,
          200,
          res,
          "ok",
          filename
        );
        return responses;
      }
      let responses = response(
        STATICVAR.USER_UPDATE_AVATAR_ERROR,
        400,
        res,
        false,
        []
      );
      return responses;
    } else {
      let responses = response(
        STATICVAR.USER_UPDATE_AVATAR_LOADING_ERROR,
        400,
        res,
        false,
        []
      );
      return responses;
    }
  } catch (error) {
    console.log(STATICVAR.USER_UPDATE_AVATAR_ERROR_METHOD, error);
  }
}

/**
 * Función para actualizar datos generales de un usuario
 */

async function updateUserLogin(req, res) {
  try {
    const { id, fullName, secondName, email, phone, documentNumber } =
      req.query;
    let { documentType } = req.query;
    console.log("documentType", documentType);
    documentType == "CC" ? (documentType = 1) : (documentType = 2);
    let data = {
      fullName: fullName,
      secondName: secondName,
      email: email,
      phone: phone,
      documentNumber: documentNumber,
      document_type_iddocument_type: documentType,
    };
    const user = await initModel.user.update(data, {
      where: { id: id },
    });
    if (user) {
      let responses = response(
        "usuario actualizado exitosamente",
        200,
        res,
        "ok",
        []
      );
      return responses;
    } else {
      let responses = response(
        "Error al actualizar datos del usuario",
        400,
        res,
        false,
        []
      );
      return responses;
    }
  } catch (error) {
    console.log(STATICVAR.USER_UPDATE_AVATAR_ERROR_METHOD, error);
  }
}

async function findUser(req, res) {
  try {
    const { id } = req.query;
    const users = await initModel.user.findOne({
      where: { id: id },
    });
    if (users) {
      delete users.dataValues.password;
      let responses = response("Users", 200, res, "ok", users);
      return responses;
    } else {
      let responses = response("Error al buscar usuario", 400, res, false, []);
      return responses;
    }
  } catch (error) {
    console.log(STATICVAR.USER_UPDATE_AVATAR_ERROR_METHOD, error);
  }
}

async function findUsers(req, res) {
  try {
    const users = await initModel.user.findAll({});
    if (users) {
      let responses = response("Users", 200, res, "ok", users);
      return responses;
    } else {
      let responses = response("Error al buscar usuarios", 400, res, false, []);
      return responses;
    }
  } catch (error) {
    console.log(STATICVAR.USER_UPDATE_AVATAR_ERROR_METHOD, error);
  }
}

module.exports = {
  userLogin,
  userLogout,
  createUser,
  deleteUserLogin,
  updatePasswordUserLogin,
  updateAvatarUserLogin,
  updateUserLogin,
  findUser,
  findUsers,
};
