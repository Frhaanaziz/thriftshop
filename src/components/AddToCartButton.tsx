'use client';

import { useTransition } from 'react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { catchError } from '@lib/utils';
import { addToCartAction } from '@app/_actions/cart';
import { Loader2 } from 'lucide-react';

const AddToCartButton = ({ productId }: { productId: string }) => {
    const [isPending, startTransition] = useTransition();

    function handleAddToCart() {
        startTransition(async () => {
            try {
                await addToCartAction({
                    productId,
                    quantity: 1,
                });
                toast.success('Added to cart.');
            } catch (err) {
                catchError(err);
            }
        });
    }

    return (
        <Button
            className="w-full"
            size="sm"
            disabled={isPending}
            onClick={handleAddToCart}
        >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Add to cart
        </Button>
    );
};

export default AddToCartButton;
