import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

const OrderSchema = new Schema({
    _id: Number,
    products: {
        type: Array,
        required: true,
    },
    id:{
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: false,
    },
});

export default model("Order", OrderSchema);



