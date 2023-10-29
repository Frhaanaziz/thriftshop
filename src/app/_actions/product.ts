'use server';

import { Database } from '@types/database.types';
import { categories } from '@lib/constant';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Products } from '@types';
import { revalidatePath } from 'next/cache';

import { cookies } from 'next/headers';

export async function getProductAction({ input }: getProductProps) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.from('products').select('*').match(input).maybeSingle();
    if (result.error) throw result.error;

    return result;
}

export async function getProductsAction({ input }: getProductProps) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.from('products').select('*').match(input);
    if (result.error) throw result.error;

    return result;
}

export async function uploadProductAction({ input }: UploadProductProps) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.from('products').insert(input);
    if (result.error) throw result.error;

    revalidatePath('/dashboard/stores/[storeId]/products', 'page');
    return result;
}

export async function deleteProductAction({ input, path }: DeleteProductProps) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.from('products').delete().match(input);
    if (result.error) throw result.error;

    path && revalidatePath(path);
    return result;
}

export async function updateProductAction({ input }: UpdateProductProps) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.from('products').upsert(input);
    if (result.error) throw result.error;

    return result;
}

export async function filterProductsAction(query: string) {
    if (query.length === 0) return null;
    const supabase = createServerActionClient<Database>({ cookies });

    const { data: filteredProducts, error } = await supabase
        .from('products')
        .select('id, name, category')
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(10);
    if (error) throw error;

    const productsByCategory = Object.values(categories).map((category) => ({
        category,
        products: filteredProducts.filter((product) => product.category === category),
    }));

    return productsByCategory;
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
    path?: string;
};

type getProductProps = {
    input: Products['Update'];
};

type UploadProductProps = {
    input: Products['Insert'];
};
