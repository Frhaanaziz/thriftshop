import { createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './database.types';

export function supabaseServerComponentClient() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

    return supabase;
}

export function supabaseServerActionClient() {
    const cookieStore = cookies();
    const supabase = createServerActionClient<Database>({ cookies: () => cookieStore });

    return supabase;
}
