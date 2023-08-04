const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./db/connectionDB");
<<<<<<< HEAD
const { router } = require("./routes/routes");
const { authSecurity } = require("./routes/authSecurityRoutes");
const accountController =
  require("./controllers/accountController").searchBalance;
import { Server as WebSocketServer } from "socket.io";
import http from "http";
import { notificationsUsers } from "./controllers/notificationController";
=======
const { router } = require('./routes/routes')
const { authSecurity } = require('./routes/authSecurityRoutes')
const accountController = require("./controllers/accountController").searchBalance

>>>>>>> 322ad4fb4b58774df6ebe667fae3dd6bbaeb18f2

dotenv.config();
let port = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server);

<<<<<<< HEAD

app.use(express.static(__dirname +'/public'))

const whitelist = [
  "http://localhost:3000",
  "https://2e24-181-62-56-224.ngrok-free.app.com:4000",
];

// ✅ Enable pre-flight requests
app.options("*", cors());

io.on("connection", async (socket) => {
  console.log("conectado al socket...")
  socket.on("conectado", async (mensaje) => {
    console.log("Mensaje : ", mensaje);
  });
  try {
    //let dataUsers = await notificationsUsers();
    let dataUsers =await connection.sequelize.query('call gambatte_db.notifications_user();')
    console.log("dataUsers", dataUsers);
    io.emit('notificatios-users', { data: dataUsers });
  } catch (error) {
    throw error;
  }
});
=======
const app = express();
const whitelist = ['http://localhost:3000', 'https://2e24-181-62-56-224.ngrok-free.app.com:4000'];

// ✅  Enable pre-flight requests
app.options('*', cors());
>>>>>>> 322ad4fb4b58774df6ebe667fae3dd6bbaeb18f2

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
<<<<<<< HEAD
app.get("/api/test:userId", accountController);
app.use("", router);
app.use("", authSecurity);
=======
app.get("/api/test:userId", accountController)
app.use('', router);
app.use('', authSecurity);
>>>>>>> 322ad4fb4b58774df6ebe667fae3dd6bbaeb18f2

const credentials = {
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
};

<<<<<<< HEAD
const main = async () => {
  let sequelize = await connection.sequelize;
  sequelize.authenticate();
  server.listen(port, () => {
    console.log("Server listening port: ", port);
  });
=======
const credentials = {
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  dialect: process.env.DIALECT
}


const main = async () => {
  let sequelize = await connection.sequelize;
  sequelize.authenticate();
  app.listen(port, () => {
    console.log("Server listening port: ", port);
  });

  return sequelize;
}
main();
>>>>>>> 322ad4fb4b58774df6ebe667fae3dd6bbaeb18f2

  return sequelize;
};
main();
