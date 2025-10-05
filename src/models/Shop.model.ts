import mongoose, { Document, Schema } from "mongoose";

export interface Shop extends Document {
    shopName: string,
    GSTIN: string,
    address: string,
    city: string,
}

const shopSchema:Schema<Shop> = new Schema({
    shopName: {
        type: String
    },
    GSTIN: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    }
}, {timestamps: true})

const ShopModel = (mongoose.models.Shop as mongoose.Model<Shop>) || mongoose.model<Shop>("Shop", shopSchema)

export default ShopModel;