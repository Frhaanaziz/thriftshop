import ProductsManageMain from './ProductsManageMain';
import { getUserAction } from '@app/_actions/user';
import { getProductsAction } from '@app/_actions/product';
import { notFound } from 'next/navigation';
import { Stores } from '@types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type ProductsManagePageProps = {
    params: { storeId: Stores['Row']['id'] };
};

export const revalidate = 604800

export async function generateStaticParams() {
    const supabase = createClientComponentClient()
    const { data } = await supabase.from('stores').select('id')
    if (!data) return []

    return data.map(store => ({ storeId: store.id }))
}

const ProductsManagePage = async ({ params: { storeId } }: ProductsManagePageProps) => {
    const author_id = (await getUserAction())?.id;
    if (!author_id) notFound();

    const { data: products } = await getProductsAction({
        input: { store_id: storeId, author_id },
    });

    return <ProductsManageMain products={products} />;
};

export default ProductsManagePage;
