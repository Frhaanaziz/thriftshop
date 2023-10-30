'use server';

import { supabaseServerActionClient } from '@database/supabase';
import { categories } from '@lib/constant';
import { Products } from '@types';
import { revalidatePath } from 'next/cache';

export async function getProductAction({ input }: { input: Products['Update'] }) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('products').select('*').match(input).maybeSingle();
    if (result.error) throw result.error;

    return result;
}

export async function getProductsAction({ input }: { input: Products['Update'] }) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('products').select('*').match(input);
    if (result.error) throw result.error;

    return result;
}

export async function uploadProductAction({ input }: { input: Products['Insert'] }) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('products').insert(input);
    if (result.error) throw result.error;

    revalidatePath('/dashboard/stores/[storeId]/products', 'page');
    return result;
}

export async function deleteProductAction({
    input,
    path,
}: {
    input: Pick<Products['Row'], 'id' | 'author_id' | 'store_id'>;
    path?: string;
}) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('products').delete().match(input);
    if (result.error) throw result.error;

    path && revalidatePath(path);
    return result;
}

export async function updateProductAction({ input }: { input: Products['Insert'] }) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('products').upsert(input);
    if (result.error) throw result.error;

    revalidatePath('/dashboard/stores/[storeId]/products', 'page');
    return result;
}

export async function filterProductsAction(query: string) {
    if (query.length === 0) return null;
    const supabase = supabaseServerActionClient();

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
