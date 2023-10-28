'use client';
import { buttonVariants } from '@components/ui/button';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

const navConfig = ['store', 'products', 'orders', 'customers', 'analytics'];

const LayoutNavList = ({ storeId }: { storeId: string }) => {
    const segment = useSelectedLayoutSegment();

    return (
        <>
            {navConfig.map((nav, i) => (
                <li
                    key={i}
                    className={`px-1 py-1.5 ${
                        segment === nav || (i === 0 && !segment) ? 'border-b-2 border-b-primary' : ''
                    }`}
                >
                    <Link
                        href={`/dashboard/stores/${storeId}/${i !== 0 ? nav : ''}`}
                        className={buttonVariants({
                            variant: 'ghost',
                            size: 'sm',
                            className: `capitalize ${
                                segment === nav || (i === 0 && !segment) ? 'text-primary' : ''
                            } `,
                        })}
                    >
                        {nav}
                    </Link>
                </li>
            ))}
        </>
    );
};

export default LayoutNavList;
