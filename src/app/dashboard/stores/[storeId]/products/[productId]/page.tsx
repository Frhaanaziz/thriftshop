import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UpdateProductForm from '../../../../../../components/forms/UpdateProductForm';
import { getProductAction } from '@app/_actions/product';
import { getUserAction } from '@app/_actions/user';
import { notFound } from 'next/navigation';

const UpdateProductPage = async ({
    params: { productId, storeId },
}: {
    params: { productId: string; storeId: string };
}) => {
    const user = await getUserAction();
    if (!user) notFound();

    const { data: product } = await getProductAction({
        input: { id: productId, store_id: storeId, author_id: user.id },
    });
    if (!product) notFound();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update product</CardTitle>
                <CardDescription>Update your product information, or delete it</CardDescription>
            </CardHeader>
            <UpdateProductForm product={product} />
        </Card>
    );
};

export default UpdateProductPage;
