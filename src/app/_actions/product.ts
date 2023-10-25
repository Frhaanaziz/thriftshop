'use server';

import { Database } from '@db/database.types';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Products } from '@types';

import { cookies } from 'next/headers';

const supabase = createServerActionClient<Database>({ cookies });

export async function getProductAction({ input }: getProductProps) {
    const result = await supabase.from('products').select().match(input).maybeSingle();
    if (result.error) throw result.error;

    return result;
}

export async function getProductsAction({ input }: getProductProps) {
    const result = await supabase.from('products').select().match(input);
    if (result.error) throw result.error;

    return result;
}

export async function uploadProductAction({ input }: UploadProductProps) {
    const result = await supabase.from('products').insert(input);
    if (result.error) throw result.error;

    return result;
}

export async function deleteProductAction({ input }: DeleteProductProps) {
    const result = await supabase.from('products').delete().match(input);
    if (result.error) throw result.error;

    return result;
}

export async function updateProductAction({ input }: UpdateProductProps) {
    const result = await supabase.from('products').upsert(input).select();
    if (result.error) throw result.error;

    return result;
}

type UpdateProductProps = {
    input: Products['Insert'];
};

type DeleteProductProps = {
    input: {
        id: string;
        author_id: string;
        store_id: string;
    };
};

type getProductProps = {
    input: Products['Update'];
};

type UploadProductProps = {
    input: Products['Insert'];
};
