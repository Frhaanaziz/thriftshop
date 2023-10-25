import { DEFAULT_PROFILE_URL } from '@constant';
import Image from 'next/image';
import UpdateProfileButton from './UpdateProfileButton';
import UpdateEmailButton from './UpdateEmailButton';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@db/database.types';
import { getSession } from '@lib/getSession';
import { notFound } from 'next/navigation';
import UpdateNameButton from './UpdateNameButton';
import { getProfileAction, getUserAction } from '@app/_actions/user';

const AccountPage = async () => {
    const supabase = createServerComponentClient<Database>({ cookies });

    const {
        data: { user },
    } = await getUserAction({ supabase });

    const { data: profile } = await getProfileAction({ supabase, user_id: user.id });
    if (!profile) notFound();

    return (
        <div className="mt-10 divide-y">
            <div className="space-y-1">
                <h3 className="text-lg font-medium leading-6 ">Profile</h3>
                <p className="max-w-2xl text-sm ">
                    This information will be displayed publicly so be careful what you share.
                </p>
            </div>
            <div className="mt-6">
                <dl className="divide-y">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt className="text-sm font-medium ">Name</dt>
                        <dd className="mt-1 flex text-sm  sm:col-span-2 sm:mt-0">
                            <span className="flex-grow">{profile.fullName}</span>
                            <span className="ml-4 flex-shrink-0">
                                <UpdateNameButton profile={profile} />
                            </span>
                        </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                        <dt className="text-sm font-medium ">Photo</dt>
                        <dd className="mt-1 flex text-sm  sm:col-span-2 sm:mt-0">
                            <span className="flex-grow">
                                <Image
                                    className="rounded-full w-8 h-8"
                                    src={profile?.avatar_url || DEFAULT_PROFILE_URL}
                                    alt=""
                                    width={32}
                                    height={32}
                                />
                            </span>
                            <span className="ml-4 flex flex-shrink-0 items-start space-x-4">
                                <UpdateProfileButton profile={profile} />
                            </span>
                        </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                        <dt className="text-sm font-medium ">Email</dt>
                        <dd className="mt-1 flex text-sm  sm:col-span-2 sm:mt-0">
                            <span className="flex-grow">{profile.email}</span>
                            <span className="ml-4 flex-shrink-0">
                                <UpdateEmailButton profile={profile} />
                            </span>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default AccountPage;
