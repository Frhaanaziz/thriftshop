import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UpdateProductForm from './UpdateProductForm';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getProductAction } from '@app/_actions/product';
import { getUserAction } from '@app/_actions/user';

const UpdateProductPage = async ({
    params: { productId, storeId },
}: {
    params: { productId: string; storeId: string };
}) => {
    const supabase = createServerComponentClient({ cookies });
    const {
        data: { user },
    } = await getUserAction({ supabase });

    const { data: product } = await getProductAction({
        supabase,
        input: { id: productId, store_id: storeId, author_id: user.id },
    });

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
