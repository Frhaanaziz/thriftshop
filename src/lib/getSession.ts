import { Database } from '@db/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

type GetSessionProps = {
    supabase: SupabaseClient<Database>;
};

export async function getSession({ supabase }: GetSessionProps) {
    const result = await supabase.auth.getSession();
    if (result.error) throw result.error;

    return result;
}
