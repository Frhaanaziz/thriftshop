import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';
import { Stores } from '@types';
import Link from 'next/link';

type FeaturedStoreProps = {
    store: {
        id: Stores['Row']['id'];
        name: Stores['Row']['name'];
        description: Stores['Row']['description'];
    };
    index: number;
};

const FeaturedStore = ({ store, index }: FeaturedStoreProps) => {
    return (
        <Link
            href={`/products?store_ids=${store.id}`}
            className="border rounded-xl overflow-hidden"
        >
            <AspectRatio ratio={21 / 9}>
                <Image
                    src={`https://pooumjecbqvuxlccnqev.supabase.co/storage/v1/object/public/store_images/store-image-${index}.jpg`}
                    alt="random"
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 35vw, (min-width: 640px) 40vw, (min-width: 475px) 50vw, 100vw"
                    fill
                />
            </AspectRatio>

            <div className="p-6">
                <h3 className="text-xl font-semibold truncate">{store.name}</h3>
                <p className="text-gray-700 dark:text-gray-400 my-2 truncate">{store.description}</p>
            </div>
        </Link>
    );
};

export default FeaturedStore;
