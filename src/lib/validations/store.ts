import z from 'zod';

export const newStoreSchema = z.object({
    name: z.string().min(3, {
        message: 'Store name must be at least 3 character(s)',
    }),
    description: z.string().optional(),
});

export const updateStoreSchema = z.object({
    name: z.string().min(3, {
        message: 'Store name must be at least 3 character(s)',
    }),
    description: z.string().optional(),
});
