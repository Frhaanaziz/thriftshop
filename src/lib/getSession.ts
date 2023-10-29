'use server';

import { Database } from '@db/database.types';
import { SupabaseClient, createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getSession() {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.auth.getSession();
    if (result.error) throw result.error;

    return result;
}
