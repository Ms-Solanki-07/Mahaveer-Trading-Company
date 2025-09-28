"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { email, z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { verifySchema } from "@/schemas/verifySchema"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"


export default function InputOTPForm() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const params = useParams<{ email: string }>()
  const userEmail = params.email

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {

    setIsSubmitting(true)
    try {
      const res = await axios.post('/api/verify-code', {
        email: userEmail,
        code: data.code
      })

      toast.success("Verification successful!", {
        duration: 1000, // 2 seconds
      });

      // Wait for toast to finish, then navigate
      setTimeout(() => {
        router.replace("/sign-in");
      }, 1000);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast.error(errorMessage ? errorMessage : 'Server Error: Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 ">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup >
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {
              isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : ('Submit OTP')
            }
          </Button>
        </form>
      </Form>
    </div>
  )
}
