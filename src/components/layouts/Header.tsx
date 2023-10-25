import { buttonVariants } from '../ui/button';
import HeaderSheet from './HeaderSheet';
import Navbar from './Navbar';
import SearchHeader from '../SearchHeader';
import CartHeader from '../CartHeader';
import Link from 'next/link';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@db/database.types';
import { cookies } from 'next/headers';
import { getSession } from '@lib/getSession';
import DropdownHeader from './DropdownHeader';
import UploadDummyDataButton from '@app/_actions/dummy/uploadDummyDataButton';

const Header = async () => {
    const supabase = createServerComponentClient<Database>({ cookies });
    const {
        data: { session },
    } = await getSession({ supabase });
    return (
        <header className="sticky border-b top-0 bg-background z-50">
            <div className="container flex h-16 justify-between items-center">
                <HeaderSheet />
                <Navbar />

                <UploadDummyDataButton user={session?.user!} />

                <div className="flex gap-3">
                    <SearchHeader />
                    <CartHeader />
                    {!session ? (
                        <Link
                            href="/auth/login"
                            className={buttonVariants({
                                size: 'sm',
                            })}
                        >
                            Sign In
                        </Link>
                    ) : (
                        <DropdownHeader supabase={supabase} />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
