'use client';

import { useId, useState } from 'react';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { catchError, cn } from '@lib/utils';
import { addToCartAction } from '@app/_actions/cart';
import { Loader2 } from 'lucide-react';

const AddToCartButton = ({ productId, className }: { productId: string; className?: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const id = useId();

    async function handleAddToCart() {
        try {
            setIsLoading(true);
            toast.loading('Adding to cart...', { id });

            const result = await addToCartAction({
                productId,
                quantity: 1,
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
