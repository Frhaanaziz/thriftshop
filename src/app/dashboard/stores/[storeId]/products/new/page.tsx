import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewProductForm from '../../../../../../components/forms/NewProductForm';

const NewProductPage = ({ params: { storeId } }: { params: { storeId: string } }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add product</CardTitle>
                <CardDescription>Add a new product to your store</CardDescription>
            </CardHeader>
            <NewProductForm storeId={storeId} />
        </Card>
    );
};

export default NewProductPage;
