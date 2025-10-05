import mongoose, { Document, Schema } from "mongoose";

export interface Product extends Document {
    name: string,
    description?: string,
    image: string,
    imagePublicId: string,
    MRP: number,
    discount: number,
    unit: string,
    category: string,
    inStock: boolean,
}

const productSchema: Schema<Product> = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    imagePublicId: {
        type: String,
        required: true
    },
    MRP: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    inStock: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

const ProductModel = (mongoose.models.Product as mongoose.Model<Product>) || mongoose.model<Product>("Product", productSchema)

export default ProductModel;