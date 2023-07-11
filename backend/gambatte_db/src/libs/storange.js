
const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/storange/img')
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname} -${Date.now()}`)
    }
  })
  
  const upload = multer({ storage }) 
  module.exports = upload;