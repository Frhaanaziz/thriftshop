'use client';
import { deleteCartItemAction, updateCartItemQuantityAction } from '@app/_actions/cart';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { catchError } from '@lib/utils';
import { updateCartItemSchema } from '@lib/validations/cart';
import { MinusIcon, PlusIcon, Trash2 } from 'lucide-react';
import { useId, useTransition } from 'react';
import toast from 'react-hot-toast';
import z from 'zod';

type Inputs = z.infer<typeof updateCartItemSchema>;

const CartCounter = ({ productId, quantity }: { productId: string; quantity: number }) => {
    const [isLoading, startTransition] = useTransition()
    const id = useId();

    function onSubmit(data: Inputs) {
        startTransition(async () => {
            try {
                toast.loading('Updating cart...', { id });

                const result = await updateCartItemQuantityAction({
                    productId,
                    quantity: data.quantity,
                });
                if (result?.errorMessage) throw new Error(result.errorMessage);

                toast.success('Cart updated.', { id });
            } catch (err) {
                catchError(err, id);
            }
        })
    }

    function handleDeleteCartitem() {
        startTransition(async () => {
            try {
                toast.loading('Deleting cart item...', { id });

                const result = await deleteCartItemAction({ productId, quantity });
                if (result?.errorMessage) throw new Error(result.errorMessage);

                toast.success('Cart item deleted.', { id });
            } catch (error) {
                catchError(error, id);
            }
        })
    }

    return (
        <div className="flex items-center space-x-2 ml-auto">
            <div className="flex items-center">
                <Button
                    id={`${id}-decrement`}
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => onSubmit({ quantity: quantity - 1 })}
                    disabled={isLoading || quantity <= 1}
                >
                    <MinusIcon
                        className="h-3 w-3"
                        aria-hidden="true"
                    />
                    <span className="sr-only">Remove one item</span>
                </Button>
                <Input
                    type="number"
                    inputMode="numeric"
                    value={quantity}
                    min={0}
                    className="h-8 w-14 rounded-none border-x-0"
                    onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = parseInt(value, 10);
                        if (isNaN(parsedValue)) return;
                        onSubmit({ quantity: parsedValue });
                    }}
                    disabled={isLoading}
                />
                <Button
                    id={`${id}-increment`}
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => onSubmit({ quantity: quantity + 1 })}
                    disabled={isLoading}
                >
                    <PlusIcon
                        className="h-3 w-3"
                        aria-hidden="true"
                    />
                    <span className="sr-only">Add one item</span>
                </Button>
            </div>

            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleDeleteCartitem}
                disabled={isLoading}
            >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Remove item</span>
            </Button>
        </div>
    );
};

export default CartCounter;
