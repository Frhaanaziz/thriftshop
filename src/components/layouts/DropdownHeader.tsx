import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, LogOut, Settings, User } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DEFAULT_PROFILE_URL } from '@lib/constant';
import Link from 'next/link';
import { getProfileAction } from '@app/_actions/user';
import { User as UserType } from '@supabase/supabase-js';

const DropdownHeader = async ({ user_id }: { user_id: UserType['id'] }) => {
    const { data: profile } = await getProfileAction({ user_id });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="hover:ring-1 hover:ring-white">
                    <AvatarImage
                        src={`${profile?.avatar_url || DEFAULT_PROFILE_URL}`}
                        alt="avatar"
                    />
                    <AvatarFallback delayMs={100}>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="text-xl capitalize">{profile?.fullName}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-sm text-muted-foreground -mt-3">
                    {profile?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/dashboard/account">
                        {' '}
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Account
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/stores">
                        {' '}
                        <DropdownMenuItem>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem disabled>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Link href="/auth/signout">
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropdownHeader;
