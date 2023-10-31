'use client';
import { Button, buttonVariants } from '@components/ui/button';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { emailSchema } from '@lib/validations/email';
import { signInUserAction } from '@app/_actions/user';

import { Input } from '@components/ui/input';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { catchError } from '@lib/utils';

const LogInForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = form;

    async function onSubmit(formData: z.infer<typeof emailSchema>) {
        const { email, password } = formData;
        try {
            const result = await signInUserAction({ input: { email, password } });
            if (result?.errorMessage) throw new Error(result.errorMessage);

            router.replace('/', { scroll: false });
            toast.success('Login successful');
        } catch (error) {
            catchError(error);
        }
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="password"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="password"
                                        autoCorrect="off"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In with Email
                    </Button>
                </form>
            </Form>

            <Link
                href="/auth/signup"
                className={buttonVariants({
                    variant: 'ghost',
                    size: 'lg',
                    className: `border ${isSubmitting && 'pointer-events-none'}`,
                })}
            >
                Sign Up
            </Link>
        </>
    );
};

export default LogInForm;
