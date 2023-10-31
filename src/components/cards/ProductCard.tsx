import { Products } from '@types';
import { formatPrice } from '@lib/utils';
import Link from 'next/link';
import AddToCartButton from '../cart/AddToCartButton';
import ProductImage from '@components/ProductImage';

type ProductCardProps = {
    product: Pick<Products['Row'], 'id' | 'name' | 'price' | 'product_images'>;
};

const ProductCard = async ({ product }: ProductCardProps) => {
    return (
        <div className="border rounded overflow-hidden w-full h-full bg-card">
            <Link href={`/product/${product.id}`}>
                <ProductImage
                    product_images={product.product_images}
                    name={product.name}
                />

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

export default ProductCard;
