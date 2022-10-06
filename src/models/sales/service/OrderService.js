import orderRepository from "../repository/orderRepository.js";
import {sendMessageToProductUpdateQueue} from "../../sales/product/productStockUpdateSender.js"
import { PENDING,ACCEPTED,REJECTED } from "../status/OrderStatus.js"
import OrderExecption from "../exception/OrderException.js";
import ProductClient from "../client/ProductClient.js";
import {BAD_REQUEST,INTERNAL_SERVER_ERROR,SUCCESS} from "../../../config/constants/HttpStatus.js";



class OrderService {

    async createOrder(req) {
        try {
            let orderData  = req.body;
            this.validateOrderData(orderData);
            const { authUser } = req;
            const { authorizarion } = req.headers;

            

            let order = this.createInitialOrder(orderData,authUser);
            await this.validateProductStock(order,authorizarion); // erro aqui 
            let createdOrder = await orderRepository.save(order);
            this.sendMessage(createdOrder);
            return {
                status: SUCCESS,
                createdOrder,
            };
        } catch (error) {
            return {
                status: error.status
                    ? error.status
                    : INTERNAL_SERVER_ERROR,
                message: error.message + " erro no create order",
            };
        }
    }

    async updateOrder(orderMessage) {
        try {
            const order = JSON.parse(orderMessage);
            if(order.salesId && order.status) {
                let existingOrder = await orderRepository.findById(order.salesId);
                if (existingOrder && order.status !== existingOrder.status) {
                    existingOrder.status = order.status;
                    existingOrder.updatedAt = new Date();
                    await orderRepository.save(existingOrder);  
                }
            } else {
                console.warn("The order message was not complete.");
            }

        } catch (error) {
            console.error("Couldn't parse order message from queue.");
            console.error(error.message);
        }
    }

    validateOrderData(data) {
        if(!data || !data.products) {
            throw new OrderExecption(BAD_REQUEST,"The products must be informed.");
        }
    }

    async validateProductStock(order,token) {
        let stockIsOK = await ProductClient.checkProductStock(order,token);
        if(stockIsOK) { // !stockIsOK 
            throw new OrderExecption(
                BAD_REQUEST,
                "The stock is out for the product."
            );
        }
    }



    createInitialOrder(orderData) {
        //const authUserString = new String(authUser);
        const NewDate = new Date();

        return {
            _id: 1001,
            products: orderData.products,
            id: orderData.id,
            user: orderData.user,
            email: orderData.email, 
            status: PENDING,
            createdAt: NewDate,
            updateAt: NewDate,
            
        }
    }

    sendMessage(createdOrder) {
        const message = {
            salesId: createdOrder.id,
            products: createdOrder.products,
        }
        sendMessageToProductUpdateQueue(message);
    }

    async findById(req) {
        const {_id} = req.params;
        //const idString = new String(id)
        this.validateInformedId(_id);
        const existingOrder = await orderRepository.findById(_id);
        if(!existingOrder){
            throw new OrderExecption (BAD_REQUEST, "The order must to be informed.");
        }
        try{
            return {
                status: SUCCESS,
                existingOrder,
            };
        } catch (error) {
            return {
                status: error.status
                    ? error.status
                    : INTERNAL_SERVER_ERROR,
                message: error.message,
            };
        }
        
    }

    validateInformedId (_id) {
        if (!_id) {
            throw new OrderExecption(BAD_REQUEST,"The order ID must to be informed.");
        }
    }

}

export default new OrderService();