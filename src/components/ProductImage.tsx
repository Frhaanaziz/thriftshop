import Image from 'next/image';
import EmptyImage from './EmptyImage';
import { AspectRatio } from './ui/aspect-ratio';
import { Products } from '@types';
import { checkImage } from '@lib/utils';

const ProductImage = async ({ product_images, name }: Pick<Products['Row'], 'product_images' | 'name'>) => {
    const isValidImage = await checkImage(product_images?.at(0));

    return (
        <AspectRatio ratio={3 / 2}>
            {isValidImage ? (
                <Image
                    src={product_images?.at(0)!}
                    alt={name}
                    className="rounded"
                    sizes="(min-width: 1024px) 15vw, (min-width: 768px) 25vw, (min-width: 640px) 30vw, (min-width: 475px) 35vw, 100vw"
                    fill
                />
            ) : (
                <EmptyImage />
            )}
        </AspectRatio>
    );
};

export default ProductImage;
