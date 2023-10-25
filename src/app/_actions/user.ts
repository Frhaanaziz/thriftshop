import { Database } from '@db/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Profiles } from '@types';

export async function getUserAction({ supabase }: getUserProps) {
    const result = await supabase.auth.getUser();
    if (result.error) throw result.error;

    return result;
}

export async function getProfileAction({ supabase, user_id }: GetProfileProps) {
    const result = await supabase.from('profiles').select().eq('user_id', user_id).maybeSingle();
    if (result.error) throw result.error;

    return result;
}

export async function updateProfileAction({ profile, filePath, supabase }: UpdateProfileProps) {
    const result = await supabase.from('profiles').upsert({
        ...profile,
        avatar_url: filePath
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`
            : profile.avatar_url,
    });
    if (result.error) throw result.error;

    return result;
}

export async function uploadAvatarAction({ supabase, file, userId }: UploadAvatarProps) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}-${Math.random()}.${fileExt}`;

    const result = await supabase.storage.from('avatars').upload(filePath, file);
    if (result.error) throw result.error;

    return result;
}

export async function deleteAvatarAction({ supabase, profile }: DeleteAvatarProps) {
    const fileName = profile.avatar_url?.split('/avatars/')[1];
    if (!fileName) throw new Error('You dont have any avatar yet');

    const profileResult = await supabase
        .from('profiles')
        .update({ avatar_url: '' })
        .eq('user_id', profile.user_id!);
    if (profileResult.error) throw profileResult.error;

    const avatarResult = await supabase.storage.from('avatars').remove([fileName]);
    if (avatarResult.error) throw avatarResult.error;

    return { profileResult, avatarResult };
}

export async function signUpUserAction({ supabase, input, fullName }: SignUpUserProps) {
    const result = await supabase.auth.signUp({
        ...input,
        options: {
            emailRedirectTo: `${location.origin}/api/auth/callback?fullName=${fullName}`,
        },
    });
    if (result.error) throw result.error.message;

    return result;
}

export async function signInUserAction({ supabase, input }: SignInUserProps) {
    const result = await supabase.auth.signInWithPassword({
        ...input,
    });
    if (result.error) throw result.error;

    return result;
}

export async function updateUserProfileAction({ supabase, input, user_id }: UpdateUserProfileProps) {
    const result = await supabase
        .from('profiles')
        .update({
            ...input,
        })
        .eq('user_id', user_id);
    if (result.error) throw result.error;

    return result;
}

export async function addUserProfileAction({ supabase, input, user_id }: AddUserProfileType) {
    const result = await supabase
        .from('profiles')
        .insert({
            ...input,
        })
        .eq('user_id', user_id);
    if (result.error) throw result.error;

    return result;
}

type AddUserProfileType = {
    supabase: SupabaseClient<Database>;
    input: Profiles['Insert'];
    user_id: string;
};

type UpdateUserProfileProps = {
    supabase: SupabaseClient<Database>;
    input: Profiles['Update'];
    user_id: string;
};

type SignInUserProps = {
    supabase: SupabaseClient<Database>;
    input: {
        email: string;
        password: string;
    };
};

type SignUpUserProps = {
    supabase: SupabaseClient<Database>;
    input: {
        email: string;
        password: string;
    };
    fullName: string;
};

type DeleteAvatarProps = {
    supabase: SupabaseClient<Database>;
    profile: Profiles['Insert'];
};

type getUserProps = {
    supabase: SupabaseClient<Database>;
};

type GetProfileProps = {
    supabase: SupabaseClient<Database>;
    user_id: string;
};

interface UpdateProfileProps {
    profile: Profiles['Row'];
    filePath?: string;
    supabase: SupabaseClient<Database>;
}

type UploadAvatarProps = {
    supabase: SupabaseClient<Database>;
    file: File;
    userId: string;
};
