import { Database } from '@db/database.types';
import { SupabaseClient, createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type GetSessionProps = {
    supabase: SupabaseClient<Database>;
};

export async function getSession({ supabase }: GetSessionProps) {
    const result = await supabase.auth.getSession();
    if (result.error) throw result.error;

    return result;
}

// export async function getSession() {
//     'use server';
//     const supabase = createServerActionClient<Database>({ cookies });
//     const result = await supabase.auth.getSession();
//     if (result.error) throw result.error;

//     return result;
// }
