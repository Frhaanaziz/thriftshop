import z from 'zod';

export const cartItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().min(0),
    subcategory: z.string().optional().nullable(),
});

export const updateCartItemSchema = z.object({
    quantity: z.number().min(0).default(1),
});
