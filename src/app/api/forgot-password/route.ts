import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import { connectDB } from "@/lib/connectDB"
import UserModel from "@/models/User.model"

export async function POST(request: Request) {
    await connectDB()

    try {
        const {email} = await request.json(); 
        
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + 5)

        const existingUser = await UserModel.findOne({ email })

        if (!existingUser) {
            return Response.json({
                success: false,
                message: "User Not exist with this email"
            }, { status: 400 })

        } else {
            existingUser.verifyCode = verifyCode,
                existingUser.verifyCodeExpiry = expiryDate
            await existingUser.save()

            //send verification code
            const emailResponse = await sendVerificationEmail("User", email, verifyCode)

            if (!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: emailResponse.message
                }, { status: 500 })
            }

            return Response.json({
                success: true,
                message: "Verificaiton code sended successfully"
            }, { status: 201 })
        }
    } catch (error) {
        console.error("Error sending verification code : ", error)
        return Response.json({
            success: false,
            message: "Error sending verification code"
        }, { status: 500 })
    }

}