import { Database } from '@db/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Stores } from '@types';

export async function getUserStoresAction({ supabase, input }: getUserStoresProps) {
    const result = await supabase.from('stores').select().match(input);
    if (result.error) throw result.error;

    return result;
}

export async function addStoreAction({ supabase, input }: AddStoreProps) {
    const result = await supabase.from('stores').insert(input);
    if (result.error?.code === '23505') throw new Error('The store name is already registered');
    if (result.error) throw result.error;

    return result;
}

export async function updateStoreAction({ supabase, input }: UpdateStoreProps) {
    const result = await supabase.from('stores').upsert(input).select();
    if (result.error?.code === '23505') throw new Error('The store name is already registered');
    if (result.error) throw result.error;

    return result;
}

export async function deleteStoreAction({ supabase, input }: DeleteStoreProps) {
    const result = await supabase.from('stores').delete().match(input);
    if (result.error) throw result.error;

    return result;
}

type DeleteStoreProps = {
    supabase: SupabaseClient<Database>;
    input: {
        id: string;
        author_id: string;
    };
};

type UpdateStoreProps = {
    supabase: SupabaseClient<Database>;
    input: Stores['Insert'];
};

type AddStoreProps = {
    supabase: SupabaseClient<Database>;
    input: Stores['Insert'];
};

type getUserStoresProps = {
    supabase: SupabaseClient<Database>;
    input: Stores['Update'];
};
