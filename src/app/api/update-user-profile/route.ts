import { connectDB } from "@/lib/connectDB";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import ShopModel from "@/models/Shop.model";
import mongoose from "mongoose";


export async function POST(request:Request) {
    await connectDB()

    try {
        const session = await getServerSession(authOptions)
        const user: User | undefined = session?.user as User | undefined

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }

        const userId = user._id
        
        if (!userId) {
            return Response.json({
                success: false,
                message: "User ID not found in session"
            }, { status: 401 });
        }

        const formData = await request.formData();
        const fullName = formData.get("fullName") as string
        const phone = formData.get("phone") as string
        const shopName = formData.get("shopName") as string
        const GSTIN = formData.get("GSTIN") as string
        const address = formData.get("address") as string
        const city = formData.get("city") as string
        const pinCode = formData.get("pinCode") as string
        const state = formData.get("state") as string
        
        if (!fullName) {
            return Response.json({
                success: false,
                message: "Full name is required"
            }, { status: 400 })
        }

        if (!shopName) {
            return Response.json({
                success: false,
                message: "Shop Name is required"
            }, { status: 400 })
        }

        const existingUser = await UserModel.findById(userId)

        if (!existingUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        } 

        if(!existingUser.shopId) {
            const newShop = await ShopModel.create({
                shopName,
                GSTIN,
                address,
                city,
                pinCode,
                state
            })

            existingUser.shopId = newShop._id as mongoose.Schema.Types.ObjectId
        } else {
            const shop = await ShopModel.findById(existingUser.shopId)
            if(shop) {
                shop.shopName = shopName
                shop.GSTIN = GSTIN
                shop.address = address
                shop.city = city
                shop.pinCode = pinCode
                shop.state = state
                await shop.save()
            }
        }

        existingUser.fullName = fullName
        existingUser.phone = phone

        await existingUser.save()

        return Response.json({
            success: true,
            message: "Profile updated successfully"
        }, { status: 200 })

    } catch (error) {
        console.error("Error in updating user profile:", error)
        return Response.json({
            success: false,
            message: "Error in updating user profile"
        }, { status: 500 })
    }
}