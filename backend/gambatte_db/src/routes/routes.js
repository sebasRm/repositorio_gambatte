const express = require("express");
const controllerUser= require('../controllers/userController');
const controllerAccount= require('../controllers/accountController');
const controllerDeposit= require('../controllers/depositController');
const controllerExpenses= require('../controllers/expensesController');
const upload = require("../libs/storange");


const router = express.Router();

/**
 * 
 * *************************************************************************************************
 *                                          Rutas de user_login
 * *************************************************************************************************
 */

/** *************************  PETICIONES GET   **************************/
//            =====>Petición para consultar el balance de un usuario
router.get('/api/account/:userId', controllerAccount.searchBalance); 



//            =====>Petición para consultar depositos del usuario
router.get('/api/deposit/:userId', controllerDeposit.findDepositByIdUser);  

//            =====>Petición para consultar retiros del usuario
router.get('/api/expenses/:userId', controllerExpenses.findExpensesByUserId);  


//            =====>Petición para consultar retiros por id del retiro
router.get('/api/expenses/id/:idExpenses', controllerExpenses.findExpensesById);  



//            =====>Petición para consultar un  depositos del usuario
router.get('/api/deposit/id/:idDeposit', controllerDeposit.findDepositById);
//            =====>Petición para consultar usuario por ID
router.get('/api/user/id', controllerUser.findUser);  

//            =====>Petición para consultar  todos los usuario
router.get('/api/user', controllerUser.findUsers);  



/** *************************  PETICIONES POST  ************************* */

//            =====>Petición para crear usuario
router.post('/api/user', controllerUser.createUser);  

//            =====>Petición para consultar el balance de un usuario
router.post('/api/validate/email', controllerUser.validateEmail); 

//            =====>Petición para crear expenses
router.post('/api/expenses', controllerExpenses.createExpenses);  

//            =====> Petición para logear usuario
router.post('/api/user/login', controllerUser.userLogin);  
//            =====>Petición para cerrar sesión de usuario
router.post('/api/user/logout', controllerUser.userLogout); 

/////////////////////////////////////////////////////////////////////
//            =====>Petición para crear deposito
router.post('/api/deposit', controllerDeposit.createDeposit); 


/**************************  PETICIONES DELETE  **************************/

//            =====>Petición para eliminar usuario
router.delete('/api/user', controllerUser.deleteUserLogin);  

/*************************    PETICIONES  PUT   **************************/
//            =====>Petición para contraseña de usuario
router.put('/api/user/updatePassword', controllerUser.updatePasswordUserLogin);  
//            =====>Petición para actualizar avatar de usuario
router.put('/api/user/updateAvatar', upload.single('avatar'), controllerUser.updateAvatarUserLogin);  

//            =====>Petición para actualizar datos generales de usuario
router.put('/api/user/update/:id', controllerUser.updateUserLogin);  


router.put('/api/user/finishRegister/:userId', controllerUser.updateFinishRegisterUser); 



module.exports ={router};