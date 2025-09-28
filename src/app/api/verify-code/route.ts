import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/User.model";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";

const verifyCodeQuerySchema = z.object({
    verifyCode: verifySchema
})

export async function POST(request: Request) {
    await connectDB()

    try {
        const { email, code } = await request.json()

        //validate with zod
        const queryParams = {
            verifyCode: { code }
        }

        const result = verifyCodeQuerySchema.safeParse(queryParams)

        if (!result.success) {
            const verifyCodeErros = result.error.format().verifyCode?.code?._errors || []

            return Response.json({
                success: false,
                message: verifyCodeErros.length > 0 ? verifyCodeErros.join(", ") : 'verification code must be 6 digits'
            }, { status: 400 })
        }

        const decodedEmail = decodeURIComponent(email)

        const user = await UserModel.findOne({ email: decodedEmail })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true,
                await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, Please resend the verification code"
            }, { status: 400 })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, { status: 400 })
        }
    } catch (error) {
        console.error("Error verify code", error)
        return Response.json({
            success: false,
            message: "Something went wrong while verifying the code"
        }, { status: 500 })
    }
}