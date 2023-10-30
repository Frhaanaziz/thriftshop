import ProductsManageMain from './ProductsManageMain';
import { getUserAction } from '@app/_actions/user';
import { getProductsAction } from '@app/_actions/product';
import { notFound } from 'next/navigation';
import { Stores } from '@types';

type ProductsManagePageProps = {
    params: { storeId: Stores['Row']['id'] };
};

const ProductsManagePage = async ({ params: { storeId } }: ProductsManagePageProps) => {
    const author_id = (await getUserAction())?.id;
    if (!author_id) notFound();

    const { data: products } = await getProductsAction({
        input: { store_id: storeId, author_id },
    });

    return <ProductsManageMain products={products} />;
};

export default ProductsManagePage;
