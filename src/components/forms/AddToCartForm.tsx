'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { catchError, cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { Loader2, MinusIcon, PlusIcon } from 'lucide-react';
import { addToCartAction } from '@app/_actions/cart';
import { useId, useState, useTransition } from 'react';
import { updateCartItemSchema } from '@lib/validations/cart';

interface AddToCartFormProps {
    productId: string;
}

type Inputs = z.infer<typeof updateCartItemSchema>;

export function AddToCartForm({ productId }: AddToCartFormProps) {
    const [isPending, startTransition] = useTransition();

    const id = useId();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form = useForm<Inputs>({
        resolver: zodResolver(updateCartItemSchema),
        defaultValues: {
            quantity: 1,
        },
    });

    async function onSubmit(data: Inputs) {
        try {
            setIsLoading(true);
            toast.loading('Adding to cart...', { id });

            const result = await addToCartAction({
                productId,
                quantity: data.quantity,
            });
            if (result?.errorMessage) throw new Error(result.errorMessage);

            toast.success('Added to cart.', { id });
        } catch (err) {
            catchError(err, id);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form
                className="flex items-center space-x-2"
                onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            >
                <div className="flex items-center">
                    <span
                        id={`${id}-increment`}
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'icon',
                            className: `h-8 w-8 rounded-r-none cursor-pointer ${
                                isLoading && 'pointer-events-none'
                            }`,
                        })}
                        onClick={() => form.setValue('quantity', form.getValues('quantity') - 1)}
                    >
                        <MinusIcon
                            className="h-3 w-3"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Remove one item</span>
                    </span>
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem className="space-y-0">
                                <FormLabel className="sr-only">Quantity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        className="h-8 w-14 rounded-none border-x-0"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const parsedValue = parseInt(value, 10);
                                            if (isNaN(parsedValue)) return;
                                            field.onChange(parsedValue);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <span
                        id={`${id}-increment`}
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'icon',
                            className: `h-8 w-8 rounded-l-none cursor-pointer ${
                                isLoading && 'pointer-events-none'
                            }`,
                        })}
                        onClick={() => form.setValue('quantity', form.getValues('quantity') + 1)}
                    >
                        <PlusIcon
                            className="h-3 w-3"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Add one item</span>
                    </span>
                </div>

                <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading}
                >
                    {isLoading && (
                        <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Add to cart
                    <span className="sr-only">Add to cart</span>
                </Button>
            </form>
        </Form>
    );
}
