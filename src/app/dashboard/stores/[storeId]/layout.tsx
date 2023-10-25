import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import SelectStoreCombobox from './SelectStoreCombobox';
import { cookies } from 'next/headers';
import { Database } from '@db/database.types';
import { getSession } from '@lib/getSession';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import LayoutNavList from './LayoutNavList';
import { getUserAction } from '@app/_actions/user';
import { getUserStoresAction } from '@app/_actions/store';

type StoreManageProps = {
    params: { storeId: string };
    children: ReactNode;
};

const StoreManageLayout = async ({ params: { storeId }, children }: StoreManageProps) => {
    const supabase = createServerComponentClient<Database>({ cookies });
    const {
        data: { user },
    } = await getUserAction({ supabase });

    const author_id = user.id;

    const { data: stores, error } = await getUserStoresAction({ supabase, input: { author_id } });
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
