import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@db/database.types';
import ProductsManageMainPage from './ProductsManageMainPage';
import { getUserAction } from '@app/_actions/user';
import { getProductsAction } from '@app/_actions/product';

type ProductsManagePageProps = {
    params: { storeId: string };
};

const ProductsManagePage = async ({ params: { storeId } }: ProductsManagePageProps) => {
    const supabase = createServerComponentClient<Database>({ cookies });
    const {
        data: { user },
    } = await getUserAction({ supabase });

    const { data: products } = await getProductsAction({
        supabase,
        input: { store_id: storeId, author_id: user.id },
    });

    return <ProductsManageMainPage products={products} />;
};

export default ProductsManagePage;
