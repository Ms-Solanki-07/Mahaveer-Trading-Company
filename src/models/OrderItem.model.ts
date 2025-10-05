import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { number } from "zod";

export interface OrderItem extends Document {
    orderId: ObjectId,
    productId: ObjectId,
    quantity: number,
    price: number,
}

const orderItemSchema: Schema<OrderItem> = new Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId
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