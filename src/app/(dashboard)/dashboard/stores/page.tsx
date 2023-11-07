import { buttonVariants } from '@components/ui/button';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import StoreCard from '../../../../components/cards/StoreCard';
import { getUserAction } from '@app/_actions/user';
import { notFound } from 'next/navigation';
import { supabaseServerComponentClient } from '@database/supabase';

const StoresPage = async () => {
    const author_id = (await getUserAction())?.id;
    if (!author_id) notFound();

    const supabase = supabaseServerComponentClient();

    const { data: stores } = await supabase
        .from('stores')
        .select('id, name ,description')
        .eq('author_id', author_id);

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
                {stores?.map((store, index) => (
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
