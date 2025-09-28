import {email, z} from 'zod'

export const signUpSchema = z.object({
    fullName: z.string().min(3, {message: "Full Name must be atleast 3 character"}),
    email: z.string().email({message: "Not a valid email"}),
    password: z.string().min(8, {message: "Password must be atleast 8 character"})
})