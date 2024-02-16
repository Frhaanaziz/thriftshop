'use client';
import {
  deleteCartItemAction,
  updateCartItemQuantityAction,
} from '@app/_actions/cart';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { catchError } from '@lib/utils';
import { updateCartItemSchema } from '@lib/validations/cart';
import { MinusIcon, PlusIcon, Trash2 } from 'lucide-react';
import { useId, useOptimistic, useState } from 'react';
import toast from 'react-hot-toast';
import z from 'zod';

type Inputs = z.infer<typeof updateCartItemSchema>;

const CartCounter = ({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) => {
  const [optimisticQuantity, addQuantity] = useOptimistic<number>(quantity);
  const [isDeleting, setIsDeleting] = useState(false);
  const id = useId();

  async function onSubmit(data: Inputs) {
    try {
      const result = await updateCartItemQuantityAction({
        productId,
        quantity: data.quantity,
      });
      if (result?.errorMessage) throw new Error(result.errorMessage);
    } catch (err) {
      catchError(err, id);
    }
  }

  async function handleDeleteCartitem() {
    try {
      setIsDeleting(true);

      const result = await deleteCartItemAction({ productId, quantity });
      if (result?.errorMessage) throw new Error(result.errorMessage);

      toast.success('Cart item deleted.', { id });
    } catch (error) {
      catchError(error, id);
    } finally {
      setIsDeleting(false);
    }
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
          disabled={isDeleting}
          onClick={async () => {
            if (optimisticQuantity <= 0) return;
            addQuantity(optimisticQuantity - 1);
            await onSubmit({ quantity: optimisticQuantity - 1 });
          }}
        >
          <MinusIcon className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Remove one item</span>
        </Button>
        <Input
          type="number"
          inputMode="numeric"
          value={optimisticQuantity}
          min={0}
          className="h-8 w-14 rounded-none border-x-0"
          disabled={isDeleting}
          onChange={async (e) => {
            const value = e.target.value;
            const parsedValue = parseInt(value, 10);
            if (isNaN(parsedValue)) return;
            addQuantity(parsedValue);
            await onSubmit({ quantity: parsedValue });
          }}
        />
        <Button
          id={`${id}-increment`}
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-l-none"
          disabled={isDeleting}
          onClick={async () => {
            addQuantity(optimisticQuantity + 1);
            await onSubmit({ quantity: optimisticQuantity + 1 });
          }}
        >
          <PlusIcon className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={isDeleting}
        onClick={handleDeleteCartitem}
      >
        <Trash2 className="h-3 w-3" />
        <span className="sr-only">Remove item</span>
      </Button>
    </div>
  );
};

export default CartCounter;
