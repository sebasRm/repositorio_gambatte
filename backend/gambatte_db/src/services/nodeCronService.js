import cron from 'node-cron'
import { io } from "../index";
import { getDataGoogleService } from './googleServices';

const squeduleTask = async function () {
    cron.schedule("*/2 * * * *", async () => {
        console.log('running a task every 10 seconds');
        try {
            let data = await getDataGoogleService('amazon')
            if (Object.keys(data).length > 0) {
                // console.log("dataUsers desde el controller", data);
                // console.log('conectado...........');
                io.emit("finance-google-data", { data });
                // io.emit("finance-google-data", { data });
            }
        } catch (error) {
            console.log('mostrando el error', error);
        }
    });
}

export {
    squeduleTask
}