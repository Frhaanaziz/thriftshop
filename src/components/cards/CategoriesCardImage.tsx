import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';

const CategoriesCardImage = ({ image }: { image: string }) => {
    return (
        <AspectRatio ratio={16 / 9}>
            <div className="absolute inset-0 z-10 bg-primary/40 dark:bg-primary-foreground/70 transition-colors dark:group-hover:bg-primary-foreground/75" />
            <Image
                src={image}
                alt="thrift"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                priority
                fill
                className="object-cover transition-transform group-hover:scale-105"
            />
        </AspectRatio>
    );
};

export default CategoriesCardImage;
