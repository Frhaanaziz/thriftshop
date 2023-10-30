import ProductsManageMain from './ProductsManageMain';
import { getUserAction } from '@app/_actions/user';
import { getProductsAction } from '@app/_actions/product';

type ProductsManagePageProps = {
    params: { storeId: string };
};

const ProductsManagePage = async ({ params: { storeId } }: ProductsManagePageProps) => {
    const user = (await getUserAction()).data.user;

    const { data: products } = await getProductsAction({
        input: { store_id: storeId, author_id: user.id },
    });

    return <ProductsManageMain products={products} />;
};

export default ProductsManagePage;
