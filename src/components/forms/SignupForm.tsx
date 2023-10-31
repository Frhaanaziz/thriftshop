'use client';
import { Button, buttonVariants } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { useEffect } from 'react';
import { signUpSchema } from '@lib/validations/auth';
import { signUpUserAction } from '@app/_actions/user';

const SignupForm = () => {
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitting, isSubmitSuccessful },
        reset,
    } = form;

    useEffect(() => {
        if (isSubmitSuccessful) reset();
    }, [isSubmitSuccessful, reset]);

    async function onSubmit(formData: z.infer<typeof signUpSchema>) {
        try {
            const { email, password, fullName } = formData;

            const { errorMessage } = await signUpUserAction({ fullName, input: { email, password } });
            if (errorMessage) throw new Error(errorMessage);

            toast.success('Check your email for confirmation');
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    <FormField
                        control={control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Fullname</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Full name"
                                        type="text"
                                        autoComplete="name"
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
                                <FormLabel className="sr-only">Password</FormLabel>
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

                    <FormField
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Confirm password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="confirm password"
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
                        Sign Up with Email
                    </Button>
                </form>
            </Form>

            <Link
                href="/auth/login"
                className={buttonVariants({
                    variant: 'ghost',
                    size: 'lg',
                    className: `border ${isSubmitting && 'pointer-events-none'}`,
                })}
            >
                Sign In
            </Link>
        </div>
    );
};

export default SignupForm;
