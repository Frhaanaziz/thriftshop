'use server';

import { revalidatePath } from 'next/cache';
import { type z } from 'zod';

import { cookies } from 'next/headers';
import { cartItemSchema } from '@lib/validations/cart';
import { Cart, CartItem, Products } from '@types';
import { supabaseServerActionClient } from '@database/supabase';
import { getErrorMessage } from '@lib/utils';
import { getProductInventoryAction } from './product';

export async function deleteCartItemAction(input: z.infer<typeof cartItemSchema>) {
    try {
        const cart = await getCartAction();

        // Filter cart items
        cart.items = cart.items?.filter((item: any) => item?.productId != input.productId);

        // Delete cart in database and cookies if empty
        if (cart.items.length === 0) {
            await deleteCartAndCookieAction();
        } else {
            await updateCartItemAction(cart.items); // Update cart in database
        }

        revalidatePath('/');
    } catch (error) {
        return { errorMessage: getErrorMessage(error) };
    }
}

export async function addToCartAction(input: z.infer<typeof cartItemSchema>) {
    const cartId = cookies().get('cartId')?.value;

    try {
        if (!cartId) {
            const { data: product } = await getProductInventoryAction(input.productId);
            if (!product) throw new Error('Product not found, please try again.');

            await createCartAndCookieAction([input]);

            revalidatePath('/');
            return;
        }

        const cart = await getCartAction();

        const { data: product } = await getProductInventoryAction(input.productId);
        if (!product) throw new Error('Product not found, please try again.');

        const cartItem = await getCartItemAction(cart, input.productId);

        if (cartItem) {
            if (product.inventory < input.quantity + cartItem.quantity)
                throw new Error(`Product is out of stock, max quantity is (${product.inventory})`);

            cartItem.quantity += input.quantity;
        } else {
            cart.items?.push(input);
        }

        await updateCartItemAction(cart.items);

        revalidatePath('/');
    } catch (error) {
        return { errorMessage: getErrorMessage(error) };
    }
}

export async function updateCartItemQuantityAction(input: z.infer<typeof cartItemSchema>) {
    try {
        if (input.quantity <= 0) return deleteCartItemAction(input);

        const cart = await getCartAction();

        // Checking if product exists
        const { data: product } = await getProductInventoryAction(input.productId);
        if (!product) throw new Error('Product not found, please try again.');

        // Checking if product is in stock
        if (product.inventory < input.quantity)
            throw new Error(`Product is out of stock, max quantity is (${product.inventory})`);

        const cartItem = await getCartItemAction(cart, input.productId);

        cartItem.quantity = input.quantity;

        await updateCartItemAction(cart.items);

        revalidatePath('/');
    } catch (error) {
        return { errorMessage: getErrorMessage(error) };
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export async function createCartAndCookieAction(items: CartItem[]) {
    const supabase = supabaseServerActionClient();

    const { data: cart, error } = await supabase.from('carts').insert({ items }).select('id').single();
    if (error) throw error;

    cookies().set('cartId', String(cart?.id));
}

export async function getCartItemAction(cart: Cart, productId: Products['Row']['id']) {
    const cartItem = cart.items?.find((item: any) => item?.productId == productId) as CartItem | undefined;
    if (!cartItem) throw new Error('Cart item not found, please try again.');

    return cartItem;
}

export async function deleteCartAndCookieAction() {
    const supabase = supabaseServerActionClient();

    const cartId = cookies().get('cartId')?.value;
    if (!cartId) throw new Error('Cart not found, please try again.');

    const { error } = await supabase.from('carts').delete().eq('id', cartId);
    if (error) throw error;

    cookies().delete('cartId');
}

export async function updateCartItemAction(cartItem: CartItem[]) {
    const supabase = supabaseServerActionClient();

    const cartId = cookies().get('cartId')?.value;
    if (!cartId) throw new Error('Cart not found, please try again.');

    const { error } = await supabase.from('carts').update({ items: cartItem }).eq('id', cartId);
    if (error) throw error;
}

export async function getCartAction() {
    const supabase = supabaseServerActionClient();

    const cartId = cookies().get('cartId')?.value;
    if (!cartId) throw new Error('Cart not found, please try again.');

    const { data } = await supabase.from('carts').select().eq('id', cartId).maybeSingle();
    const cart = data as Cart | null;
    if (!cart) throw new Error('Cart not found, please try again.');

    return cart;
}
