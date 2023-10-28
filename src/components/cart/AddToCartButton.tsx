'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { catchError, cn } from '@lib/utils';
import { addToCartAction } from '@app/_actions/cart';
import { Loader2 } from 'lucide-react';

const AddToCartButton = ({ productId, className }: { productId: string; className?: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleAddToCart() {
        try {
            setIsLoading(true);

            await addToCartAction({
                productId,
                quantity: 1,
            });
            toast.success('Added to cart.');
        } catch (err) {
            catchError(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            className={cn(className, 'w-full')}
            size="sm"
            disabled={isLoading}
            onClick={handleAddToCart}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Add to cart
        </Button>
    );
};

export default AddToCartButton;
