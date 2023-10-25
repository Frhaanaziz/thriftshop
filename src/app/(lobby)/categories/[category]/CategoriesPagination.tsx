'use client';
import { PaginationButton } from '@components/PaginationButton';
import { Products } from '@types';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface CategoriesPaginationProps {
    products: Products['Row'][];
    pageCount: number;
}

const CategoriesPagination = ({ products, pageCount }: CategoriesPaginationProps) => {
    const searchParams = useSearchParams();

    const page = searchParams?.get('page') ?? '1';
    const per_page = searchParams?.get('per_page') ?? '11';
    const sort = searchParams?.get('sort') ?? 'createdAt.desc';
    // const store_ids = searchParams?.get('store_ids');
    // const store_page = searchParams?.get('store_page') ?? '1';

    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(searchParams?.toString());

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            }

            return newSearchParams.toString();
        },
        [searchParams]
    );

    return (
        <>
            {products.length ? (
                <PaginationButton
                    pageCount={pageCount}
                    page={page}
                    per_page={per_page}
                    sort={sort}
                    createQueryString={createQueryString}
                />
            ) : null}
        </>
    );
};

export default CategoriesPagination;
