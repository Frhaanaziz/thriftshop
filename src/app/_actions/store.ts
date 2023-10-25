'use server';

import { Database } from '@db/database.types';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Stores } from '@types';
import { cookies } from 'next/headers';

const supabase = createServerActionClient<Database>({ cookies });

export async function getUserStoresAction({ input }: getUserStoresProps) {
    const result = await supabase.from('stores').select().match(input);
    if (result.error) throw result.error;

    return result;
}

export async function addStoreAction({ input }: AddStoreProps) {
    const result = await supabase.from('stores').insert(input);
    if (result.error?.code === '23505') throw new Error('The store name is already registered');
    if (result.error) throw result.error;

    return result;
}

export async function updateStoreAction({ input }: UpdateStoreProps) {
    const result = await supabase.from('stores').upsert(input).select();
    if (result.error?.code === '23505') throw new Error('The store name is already registered');
    if (result.error) throw result.error;

    return result;
}

export async function deleteStoreAction({ input }: DeleteStoreProps) {
    const result = await supabase.from('stores').delete().match(input);
    if (result.error) throw result.error;

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
