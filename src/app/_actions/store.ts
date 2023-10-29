'use server';

import { supabaseServerActionClient } from '@database/supabase';
import { Stores } from '@types';
import { revalidatePath } from 'next/cache';

export async function getUserStoresAction({ input }: getUserStoresProps) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('stores').select('*').match(input);
    if (result.error) throw result.error;

    return result;
}

export async function addStoreAction({ input }: AddStoreProps) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('stores').insert(input);
    if (result.error?.code === '23505') throw new Error('The store name is already registered');
    if (result.error) throw result.error;

    revalidatePath('/dashboard/stores');
    return result;
}

export async function updateStoreAction({ input }: UpdateStoreProps) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('stores').upsert(input);
    if (result.error?.code === '23505') throw new Error('The store name is already registered');
    if (result.error) throw result.error;

    revalidatePath('/dashboard/stores/[storeId]', 'page');
    return result;
}

export async function deleteStoreAction({ input }: DeleteStoreProps) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('stores').delete().match(input);
    if (result.error) throw result.error;

    revalidatePath('/dashboard/stores');
    return result;
}

type DeleteStoreProps = {
    input: {
        id: string;
        author_id: string;
    };
};

type UpdateStoreProps = {
    input: Stores['Insert'];
};

type AddStoreProps = {
    input: Stores['Insert'];
};

type getUserStoresProps = {
    input: Stores['Update'];
};
