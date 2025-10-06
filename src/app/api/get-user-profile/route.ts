import { connectDB } from "@/lib/connectDB";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
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

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return Response.json({
                success: false,
                message: "User ID not found or invalid in session"
            }, { status: 401 });
        }

        const userData = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "shops",
                    localField: "shopId",
                    foreignField: "_id",
                    as: "shopDetails"
                }
            },
            { 
                $project: {
                    fullName: 1,
                    email: 1,
                    role: 1,
                    phone: 1,
                    shopDetails: 1
                }
            }, 
        ])

        if (!userData.length) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "User profile fetched successfully",
            user: userData[0]
        }, { status: 200 })


    } catch (error) {
        console.log("Error in get user profile API", error);
        return Response.json({
            success: false,
            message: "Error in get user profile API"
        }, { status: 500 })
    }
}