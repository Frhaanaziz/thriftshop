import ProductsManageMainPage from './ProductsManageMainPage';
import { getUserAction } from '@app/_actions/user';
import { getProductsAction } from '@app/_actions/product';

type ProductsManagePageProps = {
    params: { storeId: string };
};

const ProductsManagePage = async ({ params: { storeId } }: ProductsManagePageProps) => {
    const {
        data: { user },
    } = await getUserAction();

    const { data: products } = await getProductsAction({
        input: { store_id: storeId, author_id: user.id },
    });

    return <ProductsManageMainPage products={products} />;
};

export default ProductsManagePage;
