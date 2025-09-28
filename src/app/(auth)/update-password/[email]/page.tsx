'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react" 
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"

export default function Page({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const [isSubmitting, setIsSubmitting] = useState(false) 
    const router = useRouter()
      const params = useParams<{ email: string }>()
      const userEmail = params.email

    //zod implemenation
    const Schema = z.object({
        newPassword: z.string().min(8, { message: "Password must be atleast 8 character" }),
        code: z
            .string()
            .min(6, { message: "Verification code must be 6 digits" })
            .regex(/^\d+$/, "Verification code must contain only numbers"),
    });

    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        defaultValues: {
            newPassword: '',
            code: ''
        }
    }) 

    const onSubmit = async (data: z.infer<typeof Schema>) => {
        setIsSubmitting(true) 
 
        try {
            const res = await axios.post<ApiResponse>('/api/update-password', {
                email: userEmail,
                newPassword: data.newPassword,
                code: data.code
            })

            toast.success(res.data.message);

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast.error(errorMessage ? errorMessage : 'Server Error: Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Password</CardTitle>
                            <CardDescription>
                                Enter new password and verificaiton code which sent to your email
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                                        <div className="grid gap-3">
                                            <FormField
                                                name="newPassword"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Create new password</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <FormField
                                                name="code"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Verification code</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                                {
                                                    isSubmitting ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Please wait
                                                        </>
                                                    ) : ('Submit')
                                                }
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
