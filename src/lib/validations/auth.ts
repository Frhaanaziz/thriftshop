import z from 'zod';

export const signUpSchema = z
    .object({
        fullName: z
            .string()
            .min(2, { message: 'Full name must be at least 2 characters' })
            .max(100, { message: 'Full name must be maximum of 100 characters' }),
        email: z.string().email({ message: 'Invalid email' }).min(1, { message: 'Email is required' }),
        password: z
            .string()
            .min(4, { message: 'Password must be at least 4 characters' })
            .max(32, { message: 'Password cannot exceed 32 characters' }),
        confirmPassword: z.string(),
    })
    .refine((state) => state.password === state.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });
