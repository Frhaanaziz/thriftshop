import FeaturedProduct from '@components/FeaturedProduct';
import { Database } from '@db/database.types';
import { toSentenceCase } from '@lib/utils';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import CategoriesPagination from '../../../../components/CategoriesPagination';

interface CategoryPageProps {
    params: {
        category: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
    const supabase = createServerComponentClient<Database>({ cookies });

    const { category } = params;
    const { page, per_page, sort, subcategories, price_range, store_ids, store_page } = searchParams;

    const limit = typeof per_page === 'string' ? parseInt(per_page) : 11;
    const from = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;
    const to = from + limit;

    const { data: products, count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('category', toSentenceCase(category))
        .range(from, to);
    if (!products) notFound();

    const pageCount = Math.ceil(productsCount! / limit);

    return (
        <>
            <h1 className="text-3xl font-bold capitalize">{category}</h1>
            <p className="text-muted-foreground mt-1 mb-10">Buy products from the best stores</p>

            <section>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-7">
                    {products.map((product) => (
                        <FeaturedProduct
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>

                <CategoriesPagination
                    products={products}
                    pageCount={pageCount}
                />
            </section>
        </>
    );
};

export default CategoryPage;
