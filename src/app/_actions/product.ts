import { Database } from '@db/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Products } from '@types';

export async function getProductAction({ supabase, input }: getProductProps) {
    const result = await supabase.from('products').select().match(input).maybeSingle();
    if (result.error) throw result.error;

    return result;
}

export async function getProductsAction({ supabase, input }: getProductProps) {
    const result = await supabase.from('products').select().match(input);
    if (result.error) throw result.error;

    return result;
}

export async function uploadProductAction({ supabase, input }: UploadProductProps) {
    const result = await supabase.from('products').insert(input);
    if (result.error) throw result.error;

    return result;
}

export async function uploadProductImagesAction({ supabase, files, storeId }: uploadProductImagesProps) {
    const uploadPromises = files.map((file: File) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${storeId}-${Math.random()}.${fileExt}`;

        return supabase.storage.from('product_images').upload(filePath, file);
    });

    const results = await Promise.all(uploadPromises);
    if (results.some((result) => result.error))
        throw new Error('Something wrong when uploading product image');

    return results;
}

export async function deleteProductAction({ supabase, input }: DeleteProductProps) {
    const result = await supabase.from('products').delete().match(input);
    if (result.error) throw result.error;

    return result;
}

export async function updateProductAction({ supabase, input }: UpdateProductProps) {
    const result = await supabase.from('products').upsert(input).select();
    if (result.error) throw result.error;

    return result;
}

type UpdateProductProps = {
    supabase: SupabaseClient<Database>;
    input: Products['Insert'];
};

type DeleteProductProps = {
    supabase: SupabaseClient<Database>;
    input: {
        id: string;
        author_id: string;
        store_id: string;
    };
};

type getProductProps = {
    supabase: SupabaseClient<Database>;
    input: Products['Update'];
};

type UploadProductProps = {
    supabase: SupabaseClient<Database>;
    input: Products['Insert'];
};

type uploadProductImagesProps = {
    supabase: SupabaseClient<Database>;
    files: File[];
    storeId: string;
};
