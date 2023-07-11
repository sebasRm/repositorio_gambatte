
const  Sequelize = require("sequelize") ;

   let sequelize = new Sequelize(
        'gambatte_db',
        'root',
        '',
        {
            host:'localhost',
            dialect:'mysql'
        }
    )

module.exports ={sequelize};