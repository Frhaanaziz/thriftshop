import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserAction } from '@app/_actions/user';
import NewProductForm from '@components/forms/NewProductForm';
import { notFound } from 'next/navigation';

const NewProductPage = async ({ params: { storeId } }: { params: { storeId: string } }) => {
    const author_id = (await getUserAction())?.id;
    if (!author_id) notFound();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add product</CardTitle>
                <CardDescription>Add a new product to your store</CardDescription>
            </CardHeader>
            <NewProductForm
                storeId={storeId}
                author_id={author_id}
            />
        </Card>
    );
};

export default NewProductPage;
