import { uploadOnCloudinary } from "@/helpers/cloudinaryAction";
import { connectDB } from "@/lib/connectDB";
import ProductModel from "@/models/Product.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await connectDB()

    try {
        const session = await getServerSession(authOptions)
        const user: User | undefined = session?.user as User | undefined

        if (!user || user.role !== 'admin') {
            return Response.json({
                success: false,
                message: "Unauthorized access"
            }, { status: 401 })
        }

        const formData = await request.formData();
        const image = formData.get("image") as File
        const name = formData.get("name")
        const description = formData.get("description")
        const MRPValue = formData.get("MRP");
        const MRP = parseFloat(typeof MRPValue === "string" ? MRPValue : ""); 
        const discountValue = formData.get("discount");
        const discount = parseFloat(typeof discountValue === "string" ? discountValue : "");
        const unit = formData.get("unit")
        const category = formData.get("category")
        const inStock = formData.get("inStock")

        if (!(image && name && MRP)) {
            return Response.json({
                success: false,
                message: "Product name, image or MRP required"
            }, { status: 400 })
        }

        const result: any = await uploadOnCloudinary(image)

        if (!result) {
            return Response.json({
                success: false,
                message: "No file uploaded on cloud"
            }, { status: 400 })
        }

        const newProduct = await ProductModel.create({
            name,
            description,
            image: result.secure_url,
            imagePublicId: result.public_id,
            MRP,
            discount,
            unit,
            category,
            inStock
        })

        return Response.json({
            success: true,
            message: "Product added successfully"
        }, { status: 200 })
    } catch (error) {
        console.error("Error Adding product : ", error)
        return Response.json({
            success: false,
            message: "Error Adding product"
        }, { status: 500 })
    }
}