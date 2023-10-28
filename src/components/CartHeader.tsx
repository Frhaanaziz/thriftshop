import { Divide, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from './ui/separator';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@db/database.types';

const CartHeader = async () => {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies });

    const cartId = cookieStore.get('cartId')?.value as string;
    const { data: cart, error } = await supabase.from('carts').select().eq('id', cartId).maybeSingle();
    if (error) throw error;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative"
                >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="flex items-center justify-center absolute -top-2 -right-1.5 bg-muted w-6 h-6 rounded-full">
                        {cart?.items?.length}
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="mb-3">
                    <SheetTitle>Cart</SheetTitle>
                </SheetHeader>

                <Separator />

                {cart && <div></div>}

                {!cart && (
                    <div className="flex flex-col justify-center items-center h-full text-muted-foreground gap-3">
                        <ShoppingCart className="w-14 h-14" />
                        <p className="font-semibold text-xl">Your cart is empty</p>
                        <p className="font-medium text-sm">Add items to your cart to checkout</p>
                    </div>
                )}
                <div>
                    <span></span>
                </div>
                {/* <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter> */}
            </SheetContent>
        </Sheet>
    );
};

export default CartHeader;
