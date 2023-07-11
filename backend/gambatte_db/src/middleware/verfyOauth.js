const jwt = require("jsonwebtoken");
const response = require("../helpers/utils").response;

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token;
  if (!authHeader) {
    return res.status(401).send({
      Authorization: false,
      message: "Falta la cabecera de autenticación",
    });
  } else {
    token = authHeader.split(" ")[1];
  }
  if (token == null) {
    return res.status(401).send({ Authorization: false, message: "Forbidden" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err)
      return res
        .status(401)
        .send({ Authorization: false, message: "El token es invalido" });
    req.user = user;
    return next();
  });
};

module.exports.verifyTokenSision = (req, res) => {
  const authHeader = req.headers["authorization"];

  let token;
  if (!authHeader) {
    return res.status(401).send({
      Authorization: false,
      message: "Falta la cabecera de autenticación",
    });
  } else {
    token = authHeader.split(" ")[1];
    token = token.replaceAll('"', "");
  }
  if (token == null) {
    return res.status(401).send({ Authorization: false, message: "Forbidden" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(401)
        .send({ Authorization: false, message: "El token es invalido" });
    }
    req.user = user;
    let {
      id,
      idUser,
      fullName,
      email,
      avatar,
      termsAndConditions,
      finishRegister,
      role,
    } = req.user.sub;
    return response("El token es valido", 200, res, "ok", {
      user: {
        id,
        idUser,
        fullName,
        email,
        avatar,
        termsAndConditions,
        finishRegister,
        role,
      },
      Authorization: true,
    });
  });
};
