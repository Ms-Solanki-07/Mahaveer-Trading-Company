import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await connectDB()

    try {
        const { fullName, email, password } = await request.json()

        if (!fullName || !email || !password) {
            return Response.json({
                success: false,
                message: "Full name, email, and password are required"
            }, { status: 400 })
        }
        
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + 5)

        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            if (existingUser.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUser.fullName = fullName,
                existingUser.password = hashedPassword,
                existingUser.verifyCode = verifyCode,
                existingUser.verifyCodeExpiry = expiryDate
                await existingUser.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = await UserModel.create({
                fullName,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate
            })
        }

        //send verification code
        const emailResponse = await sendVerificationEmail(fullName, email, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User registered successfully, Please verify your email"
        }, {status: 201})

    } catch (error) {
        console.error("Error registering user : ", error)
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {status:500})
    }
}