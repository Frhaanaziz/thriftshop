import { notFound } from 'next/navigation';
import { getUserStoresAction } from '@app/_actions/store';
import { getUserAction } from '@app/_actions/user';
import UpdateStoreForm from '@components/forms/UpdateStoreForm';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type StoreManageProps = {
    params: { storeId: string };
};

export const revalidate = 604800

export async function generateStaticParams() {
    const supabase = createClientComponentClient()
    const { data } = await supabase.from('stores').select('id')
    if (!data) return []

    return data.map(store => ({ storeId: store.id }))
}

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

            <UpdateStoreForm currentStore={currentStore} />
        </div>
    );
};

export default StoreManagePage;
