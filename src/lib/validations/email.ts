import z from 'zod';

export const emailSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }).min(1, 'Email is required'),
    password: z
        .string()
        .min(4, { message: 'Password must be at least 4 characters' })
        .max(32, { message: 'Password cannot exceed 32 characters' }),
});
