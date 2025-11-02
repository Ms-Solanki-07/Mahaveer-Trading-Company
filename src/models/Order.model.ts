import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface Order extends Document {
    userId: ObjectId,
    orderDate: Date,
    totalAmount: number,
    invoiceUrl?: string,
    invoicePublicId?: string,
}

const orderSchema: Schema<Order> = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    orderDate: {
        type: Date
    },
    totalAmount: {
        type: Number
    },
    invoiceUrl: {
        type: String,
    },
    invoicePublicId: {
        type: String,
    }
}, { timestamps: true })

const OrderModel = (mongoose.models.Order as mongoose.Model<Order>) || mongoose.model<Order>("Order", orderSchema)

export default OrderModel;