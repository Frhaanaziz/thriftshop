'use server';

import { supabaseServerActionClient } from '@database/supabase';
import { Stores } from '@types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getUserStoresAction({ input }: { input: Stores['Update'] }) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('stores').select('*').match(input);
    if (result.error) throw result.error;

    return result;
}

export async function addStoreAction({ input }: { input: Stores['Insert'] }) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('stores').insert(input);
    if (result.error?.code === '23505') result.error.message = 'The store name is already registered';
    else if (result.error) result.error.message = 'Failed to create your store, please try again.';

    revalidatePath('/dashboard/stores');
    return result;
}

export async function updateStoreAction({ input }: { input: Stores['Insert'] }) {
    const supabase = supabaseServerActionClient();

    const result = await supabase.from('stores').upsert(input);
    if (result.error?.code === '23505') result.error.message = 'The store name is already registered';
    else if (result.error) result.error.message = 'Failed to update your store, please try again.';

    revalidatePath('/dashboard/stores/[storeId]', 'page');
    return result;
}

export async function deleteStoreAction({ input }: { input: Pick<Stores['Row'], 'id' | 'author_id'> }) {
    const supabase = supabaseServerActionClient();

    await supabase.from('stores').delete().match(input);

    revalidatePath('/dashboard/stores');
    redirect('/dashboard/stores');
}
