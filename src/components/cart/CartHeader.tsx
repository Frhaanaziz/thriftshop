import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@db/database.types';
import CartHeaderContent from './CartHeaderContent';
import { Cart } from '@types';

const CartHeader = async () => {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies });

    const cartId = cookieStore.get('cartId')?.value as string;
    const { data } = await supabase.from('carts').select().eq('id', cartId).maybeSingle();
    const cart = data as Cart | null;

    const totalProductItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative"
                >
                    <ShoppingCart className="h-4 w-4" />
                    {cart && cart.items?.length > 0 && (
                        <span className="flex items-center justify-center absolute -top-2 -right-1.5 bg-muted w-6 h-6 rounded-full">
                            {totalProductItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl w-full">
                <CartHeaderContent cart={cart} />
            </SheetContent>
        </Sheet>
    );
};

export default CartHeader;
