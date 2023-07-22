
const { v4: uuidv4 } = require('uuid');
let moment = require('moment');
const fs = require("fs");
const path = require("path");

const STATICVAR = require("../helpers/utils").staticVar;
const { response } = require('../helpers/utils');



const uploapFile = (req, res) => {

    let img = null
   let imgTwo=null
    let keysFiles = Object.keys(req.files)
 if(keysFiles.length>1){

    img = req.files.image
   
    let ext_file = ['png', 'PNG', 'jpg', 'JPG', 'jpge', 'jpeg', 'mpge', 'mpg', 'gif'];
    let ext_type = img.name.split('.')[1];
   
    imgTwo = req.files.image_two
    let ext_file_two = ['png', 'PNG', 'jpg', 'JPG', 'jpge', 'jpeg', 'mpge', 'mpg', 'gif'];
    let ext_type_two = imgTwo.name.split('.')[1];

    if (ext_file.indexOf(ext_type) < 0 || ext_file_two.indexOf(ext_type_two) < 0 ) {
        let msg = STATICVAR.USER_UPDATE_FILE_ERROR.replace('NAME_FILE', img.name)
        msg += msg.replace('EXT_AVALIBLE', ext_file.join(', '))
        return response(msg, 400, res, false, []);
    }
  
    else {
        let fecha = moment().format('YYYY-MM-DD').replace('-', '_')
        let fileName = `${uuidv4()}-${fecha}-${img.name}`
        // let ruta = path.resolve(__dirname, '../images')
        let route = `./src/storage/images/${fileName}`
        img.mv(`${route}`, (error) => {
            if (error) {
                return response(STATICVAR.USER_UPDATE_AVATAR_ERROR, 400, res, false, []);
            }
          
        })
        let fileNameTwo = `${uuidv4()}-${fecha}-${imgTwo.name}`
        let routeTwo = `./src/storage/images/${fileNameTwo}`
        imgTwo.mv(`${routeTwo}`, (error) => {
            if (error) {
                return response(STATICVAR.USER_UPDATE_AVATAR_ERROR, 400, res, false, []);
            }
            return response(STATICVAR.USER_UPDATE_AVATAR_SUCCESSFULL, 200, res, "ok", fileNameTwo);
        })
    }
 }else{
    if (!req.files) {
        return res.status(400).send(
            {
                ok: false,
                err: {
                    message: 'No se seleccionado ningún archivo'
                }
            });
    }

    img = req.files.image
    let ext_file = ['png', 'PNG', 'jpg', 'JPG', 'jpge', 'jpeg', 'mpge', 'mpg', 'gif'];
    let ext_type = img.name.split('.')[1];
    if (ext_file.indexOf(ext_type) < 0) {
        let msg = STATICVAR.USER_UPDATE_FILE_ERROR.replace('NAME_FILE', img.name)
        msg += msg.replace('EXT_AVALIBLE', ext_file.join(', '))
        return response(msg, 400, res, false, []);
    }
    else {
        let fecha = moment().format('YYYY-MM-DD').replace('-', '_')
        let fileName = `${uuidv4()}-${fecha}-${img.name}`
        // let ruta = path.resolve(__dirname, '../images')
        let route = `./src/storage/images/${fileName}`
        img.mv(`${route}`, (error) => {
            if (error) {
                return response(STATICVAR.USER_UPDATE_AVATAR_ERROR, 400, res, false, []);
            }
            return response(STATICVAR.USER_UPDATE_AVATAR_SUCCESSFULL, 200, res, "ok", fileName);
        })
    }
 }
}

function getImageFile(req, res) {
    let imageFIle = req.params.imageFile;
    let pathFIle = `./src/storage/images/${imageFIle}`;
    if (fs.existsSync(pathFIle)) {
        res.sendFile(path.resolve(pathFIle));
    } else {
        console.log('Error : ');
        return res.status(404).send({ message: "No se ha encontrado la imagen" });
    }
}

const deleteFile = (file) => {
    let pathFIle = `./src/storage/images/${file}`;
    // console.log(pathFIle);
    try {
        fs.unlinkSync(pathFIle);
        return true;
    } catch (err) {
        console.error("Something wrong happened removing the file", err);
        return false;
    }
};

module.exports = {
    uploapFile,
    getImageFile,
    deleteFile
}