import { getProductAction } from '@app/_actions/product';
import EmptyImage from '@components/EmptyImage';
import { Separator } from '@components/ui/separator';
import { Database } from '@db/database.types';
import { formatPrice } from '@lib/utils';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChevronRight } from 'lucide-react';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartForm } from '../../../../components/forms/AddToCartForm';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import FeaturedProduct from '@components/FeaturedProduct';
import { AspectRatio } from '@components/ui/aspect-ratio';

const ProductPage = async ({ params: { productId } }: { params: { productId: string } }) => {
    const supabase = createServerComponentClient<Database>({ cookies });

    const { data: product } = await getProductAction({ input: { id: productId } });
    if (!product) notFound();

    const { data: store } = await supabase.from('stores').select('name').eq('id', product.store_id!).single();
    if (!store) notFound();

    const { data: otherProducts } = await supabase
        .from('products')
        .select('id, name, price, product_images')
        .match({ store_id: product.store_id, author_id: product.author_id })
        .neq('id', product.id);

    return (
        <>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground font-semibold mb-7">
                <Link
                    href="/products"
                    className="hover:text-primary transition"
                >
                    Products
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link
                    href={`/products?category=${product.category.toLowerCase()}`}
                    className="hover:text-primary transition"
                >
                    {product.category}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link
                    href={`/product/${product.id}`}
                    className="text-primary"
                >
                    {product.name}
                </Link>
            </nav>

            <section className="flex flex-col gap-8 md:flex-row md:gap-16">
                {product.product_images?.at(0) ? (
                    <div className="h-full w-full flex-1">
                        <AspectRatio ratio={1 / 1}>
                            <Image
                                src={product.product_images.at(0)!}
                                alt="random"
                                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 90vw"
                                priority
                                fill
                            />
                        </AspectRatio>
                    </div>
                ) : (
                    <EmptyImage />
                )}

                <div className="flex w-full flex-col gap-4 md:w-1/2">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-bold text-xl lg:text-2xl">{product.name}</h1>
                        <span className="text-muted-foreground">{formatPrice(product.price)}</span>
                        <Link
                            href={`/products/?store_ids=${product.store_id}`}
                            className="text-muted-foreground hover:underline"
                        >
                            {store?.name}
                        </Link>
                    </div>

                    <Separator />

                    <AddToCartForm productId={product.id} />

                    <Separator />

                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                    >
                        <AccordionItem value="description">
                            <AccordionTrigger>Description</AccordionTrigger>
                            <AccordionContent>{product.description}</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {otherProducts && (
                <section className="my-10">
                    <h2 className="text-2xl font-bold">More products from {store.name}</h2>
                    <div className="overflow-x-auto pb-2 pt-6">
                        <div className="flex w-fit gap-4">
                            {otherProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="border bg-card text-card-foreground shadow h-full overflow-hidden rounded-sm min-w-[260px] flex items-start"
                                >
                                    <FeaturedProduct product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default ProductPage;
