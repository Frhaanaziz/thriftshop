import Products from '@components/Products';
import { supabaseServerComponentClient } from '@database/supabase';

interface ProductsPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
    const supabase = supabaseServerComponentClient();

    const { page, per_page, sort, subcategories, price_range, store_ids, store_page } = searchParams;

    const limit = typeof per_page === 'string' ? parseInt(per_page) : 11;
    const from = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;
    const to = from + limit;

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

    if (store_ids)
        query = supabase
            .from('products')
            .select('*', { count: 'exact' })
            .eq('store_id', store_ids)
            .range(from, to)
            .order('created_at', { ascending: false });

    const { data: products, count: productsCount } = await query;

    const pageCount = Math.ceil(productsCount! / limit);

    return (
        <>
            <h1 className="font-bold tracking-tighter text-2xl md:text-3xl">Products</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Buy products from our store</p>

            <section className="my-10">
                <Products
                    pageCount={pageCount}
                    products={products}
                />
            </section>
        </>
    );
};

export default ProductsPage;
