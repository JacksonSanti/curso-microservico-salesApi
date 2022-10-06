import { Router } from "express";
import orderController from "../controler/orderController.js";

const router = new Router();

router.post('/api/order/create', orderController.createOrder);

router.get('/api/order/:_id', orderController.findById);

export default router;