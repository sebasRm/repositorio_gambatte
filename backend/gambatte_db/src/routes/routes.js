const express = require("express");
const controllerUser= require('../controllers/userController');
const controllerAccount= require('../controllers/accountController');
const controllerDeposit= require('../controllers/depositController');
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
router.get('/api/deposit', controllerDeposit.searchDeposit);  

//            =====>Petición para consultar usuario por ID
router.get('/api/user/id', controllerUser.findUser);  

//            =====>Petición para consultar  todos los usuario
router.get('/api/user', controllerUser.findUsers);  



/** *************************  PETICIONES POST  ************************* */

//            =====>Petición para crear usuario
router.post('/api/user', controllerUser.createUser);  
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
router.put('/api/user/update', controllerUser.updateUserLogin);  




module.exports ={router};