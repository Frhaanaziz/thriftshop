'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { type z } from 'zod';

import { cookies } from 'next/headers';
import { Database } from '@db/database.types';
import { cartItemSchema } from '@lib/validations/cart';
import { CartItem } from '@types';

export async function addToCartAction(input: z.infer<typeof cartItemSchema>) {
    const supabase = createServerActionClient<Database>({ cookies });

    // Checking if product is in stock
    const { data: product } = await supabase
        .from('products')
        .select('inventory')
        .eq('id', input.productId)
        .maybeSingle();

    if (!product) {
        throw new Error('Product not found, please try again.');
    }

    if (product.inventory < input.quantity) {
        throw new Error('Product is out of stock, please try again later.');
    }

    const cookieStore = cookies();
    const cartId = cookieStore.get('cartId')?.value;

    if (!cartId) {
        const { data: cart, error: insertCartError } = await supabase
            .from('carts')
            .insert({ items: [input] })
            .select('id')
            .single();
        if (insertCartError) throw insertCartError;

        cookieStore.set('cartId', String(cart?.id));

        revalidatePath('/');
        return;
    }

    const { data: cart } = await supabase.from('carts').select().eq('id', cartId).maybeSingle();

    if (!cart) {
        cookieStore.set({
            name: 'cartId',
            value: '',
            expires: new Date(0),
        });

        await supabase.from('carts').delete().eq('id', cartId);

        throw new Error('Cart not found, please try again.');
    }

    const cartItem = cart.items?.find((item: any) => item?.productId == input.productId) as
        | CartItem
        | undefined;

    if (cartItem) {
        cartItem.quantity += input.quantity;
    } else {
        cart.items?.push(input);
    }

    await supabase.from('carts').update({ items: cart.items }).eq('id', cartId);

    revalidatePath('/');
}
