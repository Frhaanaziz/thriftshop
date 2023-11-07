import { toSentenceCase } from '@lib/utils';
import { supabaseServerComponentClient } from '@database/supabase';
import Products from '@components/Products';
import { categories } from '@lib/constant';

interface CategoryPageProps {
    params: {
        category: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export async function generateStaticParams() {
    return categories.map(category => ({ category: category.toLowerCase() }))
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
    const supabase = supabaseServerComponentClient();

    const { category } = params;
    const { page, per_page, sort, subcategories, price_range, store_ids, store_page } = searchParams;

    const limit = typeof per_page === 'string' ? parseInt(per_page) : 11;
    const from = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;
    const to = from + limit;

    const { data: products, count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('category', toSentenceCase(category))
        .range(from, to)
        .order('created_at', { ascending: false });

    const pageCount = Math.ceil(productsCount! / limit);

    return (
        <>
            <h1 className="text-3xl font-bold capitalize">{category}</h1>
            <p className="text-muted-foreground mt-1">Buy products from the best stores</p>

            <section className="my-10">
                <Products
                    pageCount={pageCount}
                    products={products}
                />
            </section>
        </>
    );
};

export default CategoryPage;
