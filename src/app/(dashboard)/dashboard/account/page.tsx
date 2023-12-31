import { DEFAULT_PROFILE_URL } from '@lib/constant';
import Image from 'next/image';
import UpdateProfileButton from '../../../../components/account/UpdateProfileButton';
import UpdateEmailButton from '../../../../components/account/UpdateEmailButton';
import { notFound } from 'next/navigation';
import UpdateNameButton from '../../../../components/account/UpdateNameButton';
import { getProfileAction, getUserAction } from '@app/_actions/user';
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar';
import { getInitials } from '@lib/utils';

const AccountPage = async () => {
    const user_id = (await getUserAction())?.id;
    if (!user_id) notFound();

    const { data: profile } = await getProfileAction({ user_id });
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
                                {/* <Image
                                    className="rounded-full w-8 h-8"
                                    src={profile?.avatar_url || DEFAULT_PROFILE_URL}
                                    alt=""
                                    width={32}
                                    height={32}
                                /> */}
                                <Avatar>
                                    <AvatarImage
                                        src={profile?.avatar_url || DEFAULT_PROFILE_URL}
                                        alt={profile.fullName}
                                    />
                                    <AvatarFallback>{getInitials(profile.fullName)}</AvatarFallback>
                                </Avatar>
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
