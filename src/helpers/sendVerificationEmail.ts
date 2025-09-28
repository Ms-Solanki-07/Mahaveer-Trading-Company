import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';
import { render } from '@react-email/render' 

export async function sendVerificationEmail(
    fullName: string,
    email: string,
    verifyCode: string
): Promise<ApiResponse> {
    //configure nodemailer
    const transporter: Transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })

    const htmlContent = await render(
        VerificationEmail({fullName, otp: verifyCode })
    )

    //Email options
    const emailOptions = {
        from: `"Mahaveer Trading Company" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verification Code | Mahaveer Trading Company",
        html: htmlContent,
        text: `Hi ${fullName}, your verification code is ${verifyCode}.`,
    }

    //send the email
    try {
        const info: SentMessageInfo = await transporter.sendMail(emailOptions)
        return {success: true, message: info}
    } catch (error: any) {
        console.error(error)
        return {success: false, message: error.message}
    }
}


