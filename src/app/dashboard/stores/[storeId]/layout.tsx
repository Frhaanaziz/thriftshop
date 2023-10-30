import SelectStoreCombobox from '../../../../components/SelectStoreCombobox';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import LayoutNavList from '../../../../components/layouts/LayoutNavList';
import { getUserAction } from '@app/_actions/user';
import { getUserStoresAction } from '@app/_actions/store';

type StoreManageProps = {
    params: { storeId: string };
    children: ReactNode;
};

const StoreManageLayout = async ({ params: { storeId }, children }: StoreManageProps) => {
    const author_id = (await getUserAction())?.id;
    if (!author_id) notFound();

    const { data: stores, error } = await getUserStoresAction({ input: { author_id } });
    if (error) throw new Error('Stores not found');

    const currentStore = stores.find((store) => store.id === storeId);

    if (!stores || !currentStore) notFound();

    return (
        <>
            <div>
                <div className="flex justify-between mb-7">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                        <p className="text-sm text-muted-foreground my-1">Manage your store</p>
                    </div>

                    <SelectStoreCombobox
                        stores={stores}
                        currentStore={currentStore}
                    />
                </div>

                <div className="border-b">
                    <ul className="flex text-sm font-semibold text-muted-foreground">
                        <LayoutNavList storeId={storeId} />
                    </ul>
                </div>
            </div>

            <main className="my-6">{children}</main>
        </>
    );
};

export default StoreManageLayout;
