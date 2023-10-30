import EmptyImage from '@components/EmptyImage';
import { Separator } from '@components/ui/separator';
import { SheetFooter, SheetHeader, SheetTitle } from '@components/ui/sheet';
import { formatPrice } from '@lib/utils';
import { Cart, CartItem } from '@types';
import { ShoppingCart } from 'lucide-react';
import CartCounter from './CartCounter';
import Image from 'next/image';
import { Button } from '@components/ui/button';
import { ScrollArea } from '@components/ui/scroll-area';
import { supabaseServerComponentClient } from '@database/supabase';

interface CartHeaderContentProps {
    cart: {
        items: Cart['items'];
    } | null;
}

const CartHeaderContent = async ({ cart }: CartHeaderContentProps) => {
    if (!cart)
        return (
            <>
                <SheetHeader className="mb-3">
                    <SheetTitle className="text-xl">Cart</SheetTitle>
                </SheetHeader>

                <Separator />

                <div className="flex flex-col justify-center items-center h-full text-muted-foreground gap-3">
                    <ShoppingCart className="w-14 h-14" />
                    <p className="font-semibold text-xl">Your cart is empty</p>
                    <p className="font-medium text-sm">Add items to your cart to checkout</p>
                </div>
            </>
        );

    const supabase = supabaseServerComponentClient();
    const totalProductItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    const productCart = await Promise.all(
        cart.items.map(async (item) => {
            const { data } = await supabase
                .from('products')
                .select('price, name, category, sub_category, product_images, id')
                .eq('id', item.productId)
                .single();
            return data;
        })
    );
    const totalProductCartPrice = productCart.reduce(
        (acc, product, i) => acc + (product?.price ?? 0) * (cart.items.at(i)?.quantity ?? 1),
        0
    );

    return (
        <>
            <SheetHeader className="mb-3 px-6">
                <SheetTitle className="text-xl">Cart {`(${totalProductItems})`} </SheetTitle>
            </SheetHeader>

            <Separator />

            <ScrollArea className="h-[73vh]">
                <div className="divide-y px-6">
                    {cart.items?.map(async (cartItem, i) => {
                        const item = cartItem as CartItem;
                        const product = productCart.at(i);
                        if (!product) return;

                        return (
                            <div
                                key={item.productId}
                                className="flex py-4"
                            >
                                <div className="mr-4">
                                    {product.product_images?.at(0) ? (
                                        <Image
                                            src={product.product_images.at(0)!}
                                            width={64}
                                            height={64}
                                            alt="Product Image"
                                        />
                                    ) : (
                                        <div className="w-16 h-16">
                                            <EmptyImage />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-0.5">
                                    <h4 className="font-semibold text-sm">{product.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {formatPrice(product.price)} x {item.quantity} ={' '}
                                        {formatPrice(product.price * item.quantity)}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        {product.category} / {product.sub_category}
                                    </p>
                                </div>

                                <CartCounter
                                    productId={product.id}
                                    quantity={cartItem.quantity}
                                />
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            <SheetFooter className="px-6">
                <div className="w-full">
                    <div className="flex flex-col gap-1 py-5 border-t">
                        <div className="flex justify-between">
                            <p>Shipping</p>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between">
                            <p>Taxes</p>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between">
                            <p>Total</p>
                            <span>{formatPrice(totalProductCartPrice)}</span>
                        </div>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        className="w-full"
                    >
                        Continue to checkout
                    </Button>
                </div>
            </SheetFooter>
        </>
    );
};

export default CartHeaderContent;
