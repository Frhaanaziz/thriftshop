import Image from 'next/image';
import { AspectRatio } from './ui/aspect-ratio';
import { Products } from '@types';
import { formatPrice } from '@lib/utils';
import Link from 'next/link';
import EmptyImage from './EmptyImage';
import AddToCartButton from './cart/AddToCartButton';

type FeaturedProductProps = {
    product: Pick<Products['Row'], 'id' | 'name' | 'price' | 'product_images'>;
};

const FeaturedProduct = async ({ product }: FeaturedProductProps) => {
    return (
        <div className="border rounded overflow-hidden w-full h-full">
            <Link href={`/product/${product.id}`}>
                <AspectRatio ratio={3 / 2}>
                    {product.product_images ? (
                        <Image
                            src={product.product_images.at(0)!}
                            alt={product.name}
                            sizes="(min-width: 1024px) 15vw, (min-width: 768px) 25vw, (min-width: 640px) 30vw, (min-width: 475px) 35vw, 100vw"
                            fill
                        />
                    ) : (
                        <EmptyImage />
                    )}
                </AspectRatio>

                <div className="p-4">
                    <p className="text-xl font-semibold truncate">{product.name}</p>
                    <span className="mb-5 font-normal text-gray-700 dark:text-gray-400">
                        {formatPrice(product.price)}
                    </span>
                </div>
            </Link>

            <div className="p-4">
                <AddToCartButton productId={product.id} />
            </div>
        </div>
    );
};

export default FeaturedProduct;
