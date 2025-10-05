
import { connectDB } from "@/lib/connectDB"
import UserModel from "@/models/User.model"
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await connectDB()

    try {
        const { email, code, newPassword } = await request.json();
 
        const expiryDate = new Date() 
        expiryDate.setMinutes(expiryDate.getMinutes() + 5)

        const decodedEmail = decodeURIComponent(email) 

        const user = await UserModel.findOne({ email: decodedEmail })

        if (!user) {
            return Response.json({
                success: false,
                message: "User Not exist with this email"
            }, { status: 400 })

        } else {
            if (user.verifyCodeExpiry < new Date()) {
                return Response.json({
                    success: false,
                    message: "Verification code expired"
                }, { status: 400 })
            } else if (user.verifyCode != code) {
                return Response.json({
                    success: false,
                    message: "Incorrect verification code"
                }, { status: 400 })
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)

            user.password = hashedPassword,
            user.verifyCode = code,
            user.verifyCodeExpiry = expiryDate
            await user.save()
            

            return Response.json({
                success: true,
                message: "Password updated successfully"
            }, { status: 200 })
        }
    } catch (error) {
        console.error("Error resetting password: ", error)
        return Response.json({
            success: false,
            message: "Error resetting password"
        }, { status: 500 })
    }

}