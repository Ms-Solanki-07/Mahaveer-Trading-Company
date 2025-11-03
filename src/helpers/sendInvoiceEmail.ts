import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer'; 
import { ApiResponse } from '@/types/ApiResponse';
import { render } from '@react-email/render'
import InvoiceEmail from '../../emails/InvoiceEmail'; 

export async function sendInvoiceEmail(
    customerName: string,
    customerEmail: string,
    invoiceNumber: string,
    invoiceDate: string,
    totalAmount: number,
    invoicePath: string
): Promise<ApiResponse> {
    //configure nodemailer
    const transporter: Transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.COMPANY_EMAIL_USER,
            pass: process.env.COMPANY_EMAIL_PASS,
        }
    }) 

    totalAmount = Number(totalAmount);

    const htmlContent = await render(
        InvoiceEmail({ customerName, invoiceNumber, invoiceDate, totalAmount })
    )

    //Email options
    const emailOptions = {
        from: `Mahaveer Trading Company <${process.env.COMPANY_EMAIL_USER}>`,
        to: customerEmail,
        subject: `Invoice from Mahaveer Trading Company`,
        html: htmlContent,
        text: `Hi ${customerName}, Please find attached the invoice for your recent purchase.`,
        attachments: [
            {
                filename: `Invoice-${invoiceDate}.pdf`,
                path: invoicePath,
            },
        ],
    }

    //send the email
    try {
        const info: SentMessageInfo = await transporter.sendMail(emailOptions) 
        return { success: true, message: info }
    } catch (error: any) {
        console.error(error)
        return { success: false, message: error.message }
    }
}


