const express = require("express");
const fileUpload = require('express-fileupload')
const controllerUser = require('../controllers/userController');
const controllerAccount = require('../controllers/accountController');
const controllerDeposit = require('../controllers/depositController');
const controllerExpenses = require('../controllers/expensesController');
// const upload = require("../libs/storange").default;

const { uploapFile, getImageFile } = require('../services/uploadServices');
const { getCountries, getCountryById } = require("../controllers/country");

const router = express.Router();

//            =====> RUTAS MODULO USUARIO
router.post('/api/user', controllerUser.createUser);
router.post('/api/validate/email', controllerUser.validateEmail);
router.get('/api/account/:userId', controllerAccount.searchBalance);
router.get('/api/user', controllerUser.findUsers);
router.get('/api/user/id/:userId', controllerUser.findUser);
router.get('/api/user/photo/:imageFile', getImageFile)
router.use(fileUpload())
router.put('/api/user/upload-file/:idUser', uploapFile);
router.put('/api/user/updatePassword', controllerUser.updatePasswordUserLogin);
router.put('/api/user/photo-update/:idUser', controllerUser.updateFile)

//            =====> Petición para actualizar datos generales de usuario
router.put('/api/user/update/:id', controllerUser.updateUserLogin);
router.put('/api/user/finishRegister/:userId', controllerUser.updateFinishRegisterUser);
//            =====> Petición para eliminar usuario
router.delete('/api/user', controllerUser.deleteUserLogin);
//            =====> Petición para logear usuario
router.post('/api/user/login', controllerUser.userLogin);
//            =====>Petición para cerrar sesión de usuario
router.post('/api/user/logout', controllerUser.userLogout);

//            =====>RUTAS MODULO DEPOSITOS
router.post('/api/deposit', controllerDeposit.createDeposit);
router.get('/api/deposit/:userId', controllerDeposit.findDepositByIdUser);
router.get('/api/deposit/id/:idDeposit', controllerDeposit.findDepositById);

//            =====> RUTAS MODULO RETIROS
router.post('/api/expenses', controllerExpenses.createExpenses);
router.get('/api/expenses/:userId', controllerExpenses.findExpensesByUserId);
router.get('/api/expenses/id/:idExpenses', controllerExpenses.findExpensesById);

//            =====> RUTAS MODULO PAISES
router.get('/api/countries', getCountries);
router.get('/api/country/:id', getCountryById);


module.exports = { router };