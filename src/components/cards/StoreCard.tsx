import { AspectRatio } from '@components/ui/aspect-ratio';
import { Stores } from '@types';
import Image from 'next/image';
import Link from 'next/link';

type StoreCardProps = {
    store: Pick<Stores['Row'], 'id' | 'name' | 'description'>;
};

const StoreCard = ({ store }: StoreCardProps) => {
    return (
        <Link href={`stores/${store.id}`}>
            <div className="rounded-xl border bg-card text-card-foreground shadow h-full overflow-hidden">
                <div className="relative w-full pb-[43%]">
                    <div className="absolute inset-0">
                        <AspectRatio
                            ratio={21 / 9}
                            className="h-full rounded-t-md border-b"
                        >
                            <Image
                                src={`https://pooumjecbqvuxlccnqev.supabase.co/storage/v1/object/public/store_images/store-image-${Math.floor(
                                    Math.random() * 15
                                )}.jpg`}
                                alt="store profile"
                                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 90vw"
                                fill
                            />
                        </AspectRatio>
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-950/50" />
                        {/* <div className="inline-flex items-center border text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 pointer-events-none absolute right-2 top-2 rounded-sm px-2 py-1 font-semibold border-red-600/10 bg-red-50 text-red-700">
                            Inactive
                        </div> */}
                    </div>
                </div>
                <div className="flex flex-col space-y-1.5 p-6">
                    <h2 className="font-semibold tracking-tight line-clamp-1 text-lg">{store.name}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">{store.description}</p>
                </div>
            </div>
        </Link>
    );
};

export default StoreCard;
