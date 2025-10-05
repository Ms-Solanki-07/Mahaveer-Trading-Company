import { z } from 'zod'

export const addProductSchema = z.object({
    name: z.string().min(4, { message: "Product name must be at least 4 characters" }),
    description: z.string(),
    MRP: z
        .string()
        .min(1, { message: "MRP is required" })
        .regex(/^\d+$/, "MRP must contain only numbers"),
    discount: z
        .string() 
        .regex(/^(100|[1-9]?[0-9])$/, "Discount must contain only numbers between 0 to 100"),
    unit: z.string().min(1, { message: "Unit is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    inStock: z.boolean()
})