import * as z from "zod";

export const updateProfileSchema = z.object({
    fullName: z.string().min(3, { message: "Full Name must be atleast 3 character" }),
    email: z.string().optional(),
    role: z.string().optional(),
    phone: z.string().min(10, { message: "Phone number must be 10 digit" }).max(10, { message: "Phone number must be 10 digit" }),
    shopName: z.string().min(3, { message: "Shop Name must be atleast 3 character" }),
    GSTIN: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    pinCode: z.string().optional(),
    state: z.string().optional()
});
 