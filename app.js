import express from "express";

import { connectMongoDb } from "./src/config/db/mongoDbConfig.js";
import { createInitialData } from "./src/config/db/initialData.js";
import {connectRabbitMq} from "./src/config/rabbitmq/rabbitConfig.js"
import CheckTotken from "./src/config/auth/CheckTotken.js";



const app = express();
const env = process.env;
const PORT = env.PORT|| 8082

connectMongoDb();
createInitialData();
connectRabbitMq();

app.use(CheckTotken);

app.get('/api/status',async (req, res)=> {
    return res.status(200).json({
        service: "Sales-api",
        status: "up",
        httpStatus: 200

    })
})
app.listen(PORT, ()=> {
console.info("Server started successfully at port 8082");
})