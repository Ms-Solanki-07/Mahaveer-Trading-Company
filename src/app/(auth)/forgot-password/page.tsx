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
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { verifySchema } from "@/schemas/verifySchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"

export default function Page({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  //zod implemenation
  const emailSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
  });

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true)

    try {
      const res = await axios.post<ApiResponse>('/api/forgot-password', data)

      toast.success("Verification successful!", {
        duration: 1000,
      });

      // Wait for toast to finish, then navigate
      setTimeout(() => {
        router.replace(`/update-password/${data.email}`);
      }, 1000);

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
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                Enter your email and we'll send you a verification code to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                      <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="m@example.com" {...field} />
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
                          ) : ('Send verificaiton code')
                        }
                      </Button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button variant="outline" className="w-full">
                        Login with Google
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
