import { Server as WebSocketServer } from "socket.io";
import http from "http";
import { io } from "../index";
import { sequelize } from "../db/connectionDB";
import { createDeposit } from "../controllers/notificationController";

export async function test() {
  io.on("connection", async (socket) => {
    console.log("conectado con el cliente...");
    socket.on("conectado", async (mensaje) => {
      console.log("Mensaje : ", mensaje);
    });
  });
}

export const getNotificationsUserDepositsExpenses = async () => {
  try {
    //let dataUsers = await notificationsUsers();
    let dataUsers = await sequelize.query(
      "call gambatte_db.notifications_user();"
    );
    //console.log("dataUsers desde el controller", dataUsers);
    io.emit("notificatios-users", { data: dataUsers });
  } catch (error) {
    throw error;
  }
};
