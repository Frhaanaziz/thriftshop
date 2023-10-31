import UpdateStoreCard from '../../../../components/UpdateStoreCard';
import { notFound } from 'next/navigation';
import { getUserStoresAction } from '@app/_actions/store';
import { getUserAction } from '@app/_actions/user';

type StoreManageProps = {
    params: { storeId: string };
};

const StoreManagePage = async ({ params: { storeId } }: StoreManageProps) => {
    const author_id = (await getUserAction())?.id;
    if (!author_id) notFound();

    const stores = (await getUserStoresAction({ input: { author_id } })).data;
    if (!stores) notFound();

    const currentStore = stores.find((store) => store.id === storeId);
    if (!currentStore) notFound();

    return (
        <div className="space-y-7">
            {/* <Card>
                <CardHeader>
                    <CardTitle>Connect to stripe</CardTitle>
                    <CardDescription>
                        Connect your store to Stripe to start accepting payments
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button size="sm">Connect to Stripe</Button>
                </CardFooter>
            </Card> */}

            <UpdateStoreCard currentStore={currentStore} />
        </div>
    );
};

export default StoreManagePage;
