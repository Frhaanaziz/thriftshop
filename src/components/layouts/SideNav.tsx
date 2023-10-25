'use client';
import { buttonVariants } from '@components/ui/button';
import { cn } from '@lib/utils';
import { Store, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { ReactNode } from 'react';

function LayoutList({ children, path }: { children: ReactNode; path: string }) {
    const segment = useSelectedLayoutSegment();
    const isActive = segment === path;
    return (
        <li
            className={cn(
                buttonVariants({
                    variant: 'ghost',
                }),
                `justify-start w-full gap-2 px-2 text-muted-foreground text-lg font-normal ${
                    isActive && 'bg-accent text-accent-foreground'
                }`
            )}
        >
            {children}
        </li>
    );
}

const SideNav = () => {
    return (
        <nav className=" hidden md:block border-r h-full">
            <ul className="py-7 pr-7 flex flex-col gap-2">
                <Link href="/dashboard/account">
                    <LayoutList path="account">
                        <UserCircle className="w-4 h-4" /> Account
                    </LayoutList>
                </Link>
                <Link href="/dashboard/stores">
                    <LayoutList path="stores">
                        <Store className="w-4 h-4" /> Stores
                    </LayoutList>
                </Link>
                {/* <Link href="/dashboard/billing">
                    <LayoutList path="billing">
                        <CreditCard className="w-4 h-4" />
                        Billing
                    </LayoutList>
                </Link>
                <Link href="/dashboard/purchases">
                    <LayoutList path="purchases">
                        <DollarSign className="w-4 h-4" /> Purchases
                    </LayoutList>
                </Link> */}
            </ul>
        </nav>
    );
};

export default SideNav;
