'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { type z } from 'zod';

import { cookies } from 'next/headers';
import { Database } from '@types/database.types';
import { cartItemSchema } from '@lib/validations/cart';
import { Cart, CartItem } from '@types';

export async function deleteCartItemAction(input: z.infer<typeof cartItemSchema>) {
    const supabase = createServerActionClient<Database>({ cookies });

    const cartId = cookies().get('cartId')?.value;
    if (!cartId) throw new Error('Cart not found, please try again.');

    const { data } = await supabase.from('carts').select('items').eq('id', cartId).maybeSingle();
    const cart = data as Cart | undefined;
    if (!cart) throw new Error('Cart not found, please try again.');

    cart.items = cart.items?.filter((item: any) => item?.productId != input.productId);

    // Delete cart in database and cookies if empty
    if (cart.items.length === 0) {
        await supabase.from('carts').delete().eq('id', cartId);
        cookies().delete('cartId');
    } else {
        // Update cart
        await supabase.from('carts').update({ items: cart.items }).eq('id', cartId);
    }

    revalidatePath('/');
}

export async function updateCartItemQuantityAction(input: z.infer<typeof cartItemSchema>) {
    if (input.quantity <= 0) return deleteCartItemAction(input);

    const supabase = createServerActionClient<Database>({ cookies });

    const cartId = cookies().get('cartId')?.value;
    if (!cartId) throw new Error('Cart not found, please try again.');

    const { data: cart } = await supabase.from('carts').select('items').eq('id', cartId).maybeSingle();
    if (!cart) throw new Error('Cart not found, please try again.');

    const cartItem = cart.items?.find((item: any) => item?.productId == input.productId) as
        | CartItem
        | undefined;
    if (!cartItem) throw new Error('Cart item not found, please try again.');

    // Checking if product exists
    const { data: product } = await supabase
        .from('products')
        .select('inventory')
        .eq('id', input.productId)
        .maybeSingle();
    if (!product) throw new Error('Product not found, please try again.');

    // Checking if product is in stock
    if (product.inventory < input.quantity)
        throw new Error('Product is out of stock, please try again later.');

    cartItem.quantity = input.quantity;

    await supabase.from('carts').update({ items: cart.items }).eq('id', cartId);

    revalidatePath('/');
}

export async function addToCartAction(input: z.infer<typeof cartItemSchema>) {
    const supabase = createServerActionClient<Database>({ cookies });

    // Checking if product is in stock
    const { data: product } = await supabase
        .from('products')
        .select('inventory')
        .eq('id', input.productId)
        .maybeSingle();
    if (!product) throw new Error('Product not found, please try again.');

    if (product.inventory < input.quantity)
        throw new Error('Product is out of stock, please try again later.');

    const cartId = cookies().get('cartId')?.value;

    if (!cartId) {
        const { data: cart, error: insertCartError } = await supabase
            .from('carts')
            .insert({ items: [input] })
            .select('id')
            .single();
        if (insertCartError) throw insertCartError;

        cookies().set('cartId', String(cart?.id));

        revalidatePath('/');
        return;
    }

    const { data: cart } = await supabase.from('carts').select('items').eq('id', cartId).maybeSingle();

    if (!cart) {
        cookies().set({
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
