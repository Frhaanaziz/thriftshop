import { buttonVariants } from '../ui/button';
import HeaderSheet from './HeaderSheet';
import Navbar from './Navbar';
import SearchHeader from '../SearchHeader';
import CartHeader from '../cart/CartHeader';
import Link from 'next/link';

import DropdownHeader from './DropdownHeader';
// import UploadDummyDataButton from '@app/_actions/dummy/uploadDummyDataButton';
import { getUserAction } from '@app/_actions/user';

const Header = async () => {
    const author_id = (await getUserAction())?.id;
    return (
        <header className="sticky border-b top-0 bg-background z-50">
            <div className="container flex h-16 justify-between items-center">
                <HeaderSheet />
                <Navbar />
                {/* {author_id && <UploadDummyDataButton author_id={author_id} />} */}
                <div className="flex gap-3">
                    <SearchHeader />
                    <CartHeader />

                    {author_id && <DropdownHeader user_id={author_id} />}

                    {!author_id && (
                        <Link
                            href="/auth/login"
                            className={buttonVariants({
                                size: 'sm',
                            })}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
