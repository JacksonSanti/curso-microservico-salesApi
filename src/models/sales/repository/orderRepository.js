import Order from "../model/Order.js"


class OrderRepository{

    async save(order) {
        try {
            return await Order.create(order);
        } catch (error) {
           console.error(error.message);
        }
    }

    async findById(_id) {
        const id = _id
        try {
            return await Order.findById(id);
        } catch (error) {
           console.error(error.message);
        }
    }

    async findAll() {
        try {
            return await Order.find();
        } catch (error) {
           console.error(error.message);
        }
    }


}

export default new OrderRepository();