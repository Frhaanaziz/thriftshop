import z from 'zod';

export const cartItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().min(0),
    subcategory: z.string().optional().nullable(),
});
