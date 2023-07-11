const  express = require("express") ;
const  cors = require("cors") ;
const  dotenv = require("dotenv") ;
const  connection  = require("./db/connectionDB");
const {router} = require('./routes/routes')
const {authSecurity} = require('./routes/authSecurityRoutes')
const accountController = require("./controllers/accountController").searchBalance


dotenv.config();
let port = process.env.PORT;


const app= express();
const whitelist = ['http://localhost:3000', 'https://2e24-181-62-56-224.ngrok-free.app.com:4000'];

// ✅ Enable pre-flight requests
app.options('*', cors());

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.get("/api/test:userId",accountController)
app.use('',router);
app.use('',authSecurity);


const credentials={
    database: process.env.DATABASE,
    user:process.env.USER,
    password:process.env.PASSWORD,
    host : process.env.HOST,
    dialect: process.env.DIALECT
}


 const main = async()=>{
    let sequelize = await connection.sequelize;
    sequelize.authenticate();
    app.listen(port, ()=>{
        console.log("Server listening port: ", port);
    });
    
    return sequelize;
}
 main();

