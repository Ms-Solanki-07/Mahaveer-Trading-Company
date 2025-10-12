import { connectDB } from "@/lib/connectDB";
import ProductModel from "@/models/Product.model"; 

export async function GET(request: Request) {
    await connectDB()

    try {
        const inStockProducts = await ProductModel.aggregate([
            {
                $match: { inStock: true } 
            },
            {
                $project: {
                    id: "$_id",
                    _id: 0,
                    name: 1,
                    description: 1,
                    image: 1,
                    MRP: 1,
                    discount: 1,
                    inStock: 1,
                    unit: 1,
                    category: 1,
                    discountPrice: { $subtract: ["$MRP", { $multiply: ["$MRP", { $divide: ["$discount", 100] }] }] }
                }
            }
        ]) 

        if (!inStockProducts) {
            return Response.json({
                success: false,
                message: "No in-stock products found",
            }, { status: 400 });
        }

        return Response.json({
                success: true,
                message: "In-stock products retrieved successfully",
                data: inStockProducts
            }, { status: 200 });
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error fetching in-stock products", 
        }, { status: 500 });
    }
}