import Order from "../../models/sales/model/Order.js";

export async function createInitialData() {
    await Order.collection.drop();
    await Order.create({
        products: [
            {
               productId:1001,
               quantity:3,
            },
            {
                productId:1002,
                quantity:2,
            },
            {
                productId:1003,
                quantity:1,
            },
        ],
        id: "syf9a0fa8y78",
        user: "test user",
        email: "testuser@gmail.com",
        status: "APPROVED",
        createdAt: new Date(),
        updatedAt: new Date(),


    })

    let initialData = await Order.find();
    console.info("Initial data was created:" + JSON.stringify(initialData, undefined, 4));
    
}