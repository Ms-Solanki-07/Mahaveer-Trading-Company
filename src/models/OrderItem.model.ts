import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { number } from "zod";

export interface OrderItem extends Document {
    orderId: {type: mongoose.Schema.Types.ObjectId, ref: "Order"},
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
    quantity: number,
    price: number,
}

const orderItemSchema: Schema<OrderItem> = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    }

}, { timestamps: true })

const OrderItemModel = (mongoose.models.OrderItem as mongoose.Model<OrderItem>) || mongoose.model<OrderItem>("orderItemSchema", orderItemSchema)

export default OrderItemModel;