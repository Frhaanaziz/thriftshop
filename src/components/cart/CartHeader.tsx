import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { cookies } from 'next/headers';
import CartHeaderContent from './CartHeaderContent';
import { Cart } from '@types';
import { supabaseServerComponentClient } from '@database/supabase';

const CartHeader = async () => {
    const supabase = supabaseServerComponentClient();

    const cartId = cookies().get('cartId')?.value as string;
    const { data } = await supabase.from('carts').select('items').eq('id', cartId).maybeSingle();
    const cart = data as Cart | null;

    const totalProductItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative"
                    aria-label="Open cart"
                >
                    <ShoppingCart className="h-4 w-4" />
                    {cart && cart.items?.length > 0 && (
                        <span className="flex items-center justify-center absolute -top-2 -right-1.5 bg-muted w-6 h-6 rounded-full">
                            {totalProductItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl w-full px-0">
                <CartHeaderContent cart={cart} />
            </SheetContent>
        </Sheet>
    );
};

export default CartHeader;
