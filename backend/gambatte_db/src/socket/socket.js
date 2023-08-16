import { io } from "../index";
import { sequelize } from "../db/connectionDB";
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

export const getPaymentsNotificationsUser = async () => {
  try {
    //let dataUsers = await notificationsUsers();
    let data = await sequelize.query(
      querys.getNotificationsUsers(), { type: sequelize.QueryTypes.SELECT }
    );
    if (data) {
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
