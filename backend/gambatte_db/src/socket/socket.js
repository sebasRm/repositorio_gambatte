import { Server as WebSocketServer } from "socket.io";
import http from "http";
import { io } from "../index";
import { sequelize } from "../db/connectionDB";
import { createDeposit } from "../controllers/notificationController";
import { querys } from "../helpers/querys";

export async function test() {
  io.on("connection", async (socket) => {
    console.log("conectado con el cliente...");
    socket.on("conectado", async (mensaje) => {
      console.log("Mensaje : ", mensaje);
    });
    // io.emit("test", { data: 'dataUsers' });
  });
}

export const getNotificationsUserDepositsExpenses = async () => {
  io.on("connection", async (socket) => {
    console.log('Hola probando un emmit de notificaciones...');
    try {
      //let dataUsers = await notificationsUsers();
      let data = await sequelize.query(
        querys.getNotificationsUsers(), { type: sequelize.QueryTypes.SELECT }
      );
      //console.log("dataUsers desde el controller", dataUsers);
      io.emit("notificatios-users", { data });
    } catch (error) {
      throw error;
    }
  });
};


export const getNotificationsUserDepositsExpenses1 = async () => {
  console.log('llegamos expenses');
  try {
    //let dataUsers = await notificationsUsers();
    let data = await sequelize.query(
      querys.getNotificationsUsers(), { type: sequelize.QueryTypes.SELECT }
    );
    if (data) {
      console.log("data desde el controller expenses", data);
      io.emit("notificatios-users", { data });
    }
  } catch (error) {
    throw error;
  }
}
export const emitNotificationCreationDepositExpenses = async (msg) => {
  try {
    //console.log("dataUsers desde el controller", dataUsers);
    io.emit("notification-created", { data: msg });
  } catch (error) {
    throw error;
  }
}
