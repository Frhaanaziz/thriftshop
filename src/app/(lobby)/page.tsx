import CategoriesCard from '@components/cards/CategoriesCard';
import FeaturedProduct from '@components/FeaturedProduct';
import FeaturedStore from '@components/layouts/FeaturedStore';
import { Button, buttonVariants } from '@components/ui/button';
import { siteConfig } from '@config/site';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@db/database.types';
import { productCategories } from '@config/products';
import { Products, Stores } from '@types';

export default async function Home() {
    const supabase = createServerComponentClient<Database>({ cookies });

    const { data: products } = await supabase
        .from('products')
        .select('id, name, price, product_images')
        .limit(8);
    const { data: stores } = await supabase.from('stores').select('id, name, description').limit(4);

    return (
        <div className="container mb-14">
            <div className="my-28 flex flex-col items-center">
                <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center">
                    {siteConfig.description}
                </h1>

                <p className="text-muted-foreground text-center text-lg lg:text-2xl my-5">
                    <Balancer>
                        Buy and sell product from independent brands and stores around the world with ease
                    </Balancer>
                </p>
                <div className="flex justify-center gap-3">
                    <Link
                        href="/products"
                        className={buttonVariants()}
                    >
                        Buy now
                    </Link>
                    <Link
                        href="/dashboard/stores"
                        className={buttonVariants({
                            variant: 'outline',
                        })}
                    >
                        Sell now
                    </Link>
                </div>
            </div>

            <div className="mb-16">
                <h2 className="text-4xl font-bold text-center py-5">Categories</h2>
                <p className="text-muted-foreground text-lg text-center mx-auto mb-5">
                    Discover amazing thrift finds from unique vintage shops and secondhand stores around the
                    world
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <CategoriesCard />
                </div>
            </div>

            <div>
                <div className="flex justify-between my-5 items-center">
                    <h2 className="text-2xl md:text-4xl font-semibold">Featured products</h2>
                    <Button>View all</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:grid-cols-4">
                    {products?.map((product) => (
                        <FeaturedProduct
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>

            <div className="my-10">
                <div className="flex justify-between my-5 items-center">
                    <h2 className="text-3xl md:text-4xl font-semibold">Featured Stores</h2>
                    <Button>View all</Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 xl:grid-cols-4 ">
                    {stores?.map((store, i) => (
                        <FeaturedStore
                            key={store.id}
                            store={store}
                            index={i}
                        />
                    ))}
                </div>
            </div>

            <div className="flex gap-4 justify-center">
                {productCategories.at(0)?.subcategories.map((subcategory) => (
                    <Link
                        key={subcategory.title}
                        href={subcategory.slug}
                        className="py-0.5 px-3 bg-muted rounded-md"
                    >
                        {subcategory.title}
                    </Link>
                ))}
            </div>
        </div>
    );
}
