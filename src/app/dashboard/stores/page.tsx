import { buttonVariants } from '@components/ui/button';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import StoreCard from './StoreCard';
import { getUserStoresAction } from '@app/_actions/store';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@db/database.types';
import { getUserAction } from '@app/_actions/user';

const StoresPage = async () => {
    const supabase = createServerComponentClient<Database>({ cookies });
    const {
        data: { user },
    } = await getUserAction({ supabase });
    const { data: stores } = await getUserStoresAction({
        supabase,
        input: { author_id: user.id },
    });

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Stores</h1>
                    <p className="text-muted-foreground">Manage your stores</p>
                </div>
                <Link
                    href="/dashboard/stores/new"
                    className={buttonVariants({ size: 'sm' })}
                >
                    Create store
                </Link>
            </div>
            <div className="flex gap-3 border rounded-lg p-2 my-7">
                <Rocket className="h-5 w- mt-2" />
                <div>
                    <h3 className="font-semibold">Heads up!</h3>
                    <p className="text-sm mb-1">
                        You are currently on the Ollie plan. You can create up to 1 stores and 20 products on
                        this plan.
                    </p>
                </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {stores.map((store, index) => (
                    <StoreCard
                        key={index}
                        store={store}
                    />
                ))}
            </section>
        </>
    );
};

export default StoresPage;
