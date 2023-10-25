import Image from 'next/image';
import { AspectRatio } from './ui/aspect-ratio';
import { Products } from '@types';
import { formatPrice } from '@lib/utils';
import Link from 'next/link';
import { Button } from './ui/button';
import EmptyImage from './EmptyImage';

type FeaturedProductProps = {
    product: Products['Row'];
    // aspect?: { width: number; height: number };
};

const FeaturedProduct = ({ product }: FeaturedProductProps) => {
    return (
        <Link
            href={`/product/${product.id}`}
            className="border rounded overflow-hidden w-full h-full"
        >
            <AspectRatio ratio={3 / 2}>
                {product.product_images ? (
                    <Image
                        src={product.product_images?.at(0) ?? 'https://source.unsplash.com/random'}
                        alt={product.name}
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 35vw, (min-width: 640px) 40vw, (min-width: 475px) 50vw, 100vw"
                        fill
                    />
                ) : (
                    <EmptyImage />
                )}
            </AspectRatio>

            <div className="p-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="mb-5 font-normal text-gray-700 dark:text-gray-400">
                    {formatPrice(product.price)}
                </p>
                <Button
                    className="w-full"
                    size="sm"
                >
                    Add to cart
                </Button>
            </div>
        </Link>
    );
};

export default FeaturedProduct;
