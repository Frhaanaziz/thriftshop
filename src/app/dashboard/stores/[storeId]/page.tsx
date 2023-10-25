import UpdateStoreCard from './UpdateStoreCard';
import { notFound } from 'next/navigation';
import { getUserStoresAction } from '@app/_actions/store';
import { getUserAction } from '@app/_actions/user';

type StoreManageProps = {
    params: { storeId: string };
};

const StoreManagePage = async ({ params: { storeId } }: StoreManageProps) => {
    const {
        data: { user },
    } = await getUserAction();

    const author_id = user.id;

    const { data: stores, error } = await getUserStoresAction({ input: { author_id } });
    if (error) throw new Error('stores not found');

    const currentStore = stores?.find((store) => store.id === storeId);

    if (!stores || !currentStore) notFound();

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
