const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./db/connectionDB");
const { router } = require("./routes/routes");
const { authSecurity } = require("./routes/authSecurityRoutes");
const accountController =
  require("./controllers/accountController").searchBalance;
import { Server as WebSocketServer } from "socket.io";
import http from "http";
import { notificationsUsers, createDeposit } from "./controllers/notificationController";

dotenv.config();
let port = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server);


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
  socket.on('new-deposit', async (socket) => {
    //console.log("soy el new deposit  =>", socket)
    createDeposit(socket)

  })

  try {
    //let dataUsers = await notificationsUsers();
    //let dataUsers =await connection.sequelize.query('call gambatte_db.notifications_user();')
    //console.log("dataUsers", dataUsers);
   // io.emit('notificatios-users', { data: dataUsers });
  } catch (error) {
    throw error;
  }
});

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
app.get("/api/test:userId", accountController);
app.use("", router);
app.use("", authSecurity);

const credentials = {
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
};

const main = async () => {
  let sequelize = await connection.sequelize;
  sequelize.authenticate();
  server.listen(port, () => {
    console.log("Server listening port: ", port);
  });

  return sequelize;
};
main();
