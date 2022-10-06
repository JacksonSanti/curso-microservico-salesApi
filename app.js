import express from "express";

import { connectMongoDb } from "./src/config/db/mongoDbConfig.js";
import { createInitialData } from "./src/config/db/initialData.js";
import { connectRabbitMq } from "./src/config/rabbitmq/rabbitConfig.js"
import CheckTotken from "./src/config/auth/CheckTotken.js";

import {sendMessageToProductUpdateQueue} from "./src/models/sales/product/productStockUpdateSender.js"
import orderRoutes from "./src/models/sales/routes/orderRoutes.js"


const app = express();
const env = process.env;
const PORT = env.PORT|| 8082

connectMongoDb();
createInitialData();
connectRabbitMq();

app.use(express.json());
app.use(CheckTotken);
app.use(orderRoutes);


app.get('/test', (req,res)=>{
    try {
        sendMessageToProductUpdateQueue([
            {
                productId: 1001,
                quantity: 2,
            },
            {
                productId: 1002,
                quantity: 12,
            }, {
                productId: 1003,
                quantity: 5,
            }
        ]);
        return res.status(200).json({status: 200})
    } catch (error) {
        console.log(err);
        return res.status(500).json({error: true})
    }

})

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