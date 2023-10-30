import Products from '@components/Products';
import { supabaseServerComponentClient } from '@database/supabase';
import { toTitleCase } from '@lib/utils';

interface SubcategoryPageProps {
    params: {
        category: string;
        subCategory: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

const SubcategoryPage = async ({ params, searchParams }: SubcategoryPageProps) => {
    const supabase = supabaseServerComponentClient();

    const { category, subCategory } = params;
    const { page, per_page, sort, subcategories, price_range, store_ids, store_page } = searchParams;

    const limit = typeof per_page === 'string' ? parseInt(per_page) : 11;
    const from = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;
    const to = from + limit;

    const { data: products, count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .range(from, to)
        .eq('sub_category', toTitleCase(subCategory))
        .order('created_at', { ascending: false });

    const pageCount = Math.ceil(productsCount! / limit);

    return (
        <>
            <h1 className="font-bold tracking-tighter text-2xl md:text-3xl capitalize">{subCategory}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Buy the best {subCategory}</p>

            <section className="my-10">
                <Products
                    pageCount={pageCount}
                    products={products}
                />
            </section>
        </>
    );
};

export default SubcategoryPage;
