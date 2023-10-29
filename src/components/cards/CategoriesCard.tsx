import { cn } from '@lib/utils';
import { buttonVariants } from '../ui/button';
import CategoriesCardImage from './CategoriesCardImage';
import { categories } from '@lib/constant';
import { productCategories } from '@config/products';
import Icon from '../Icon';
import Link from 'next/link';
import { supabaseServerComponentClient } from '@database/supabase';

const CategoriesCard = async () => {
    const supabase = supabaseServerComponentClient();

    const counts = await Promise.all(
        categories.map((category) => {
            return supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('category', category)
                .then((res) => res.count);
        })
    );

    return (
        <>
            {productCategories.map((category, i) => (
                <Link
                    href={`/categories/${category.title}`}
                    key={category.title}
                    className="group relative rounded-md overflow-hidden"
                >
                    <CategoriesCardImage image={category.image} />

                    <div className="absolute inset-4 z-20 flex flex-col">
                        <div className="flex items-start justify-between space-x-4">
                            <div
                                className={cn(
                                    buttonVariants({
                                        size: 'icon',
                                        className: 'pointer-events-none h-8 w-8 bg-zinc-100 text-zinc-950',
                                    })
                                )}
                                aria-hidden="true"
                            >
                                <Icon
                                    name={category.icon}
                                    className="h-4 w-4"
                                />
                            </div>
                            <p className="text-sm lg:textlg font-semibold text-zinc-200">
                                {counts.at(i)} products
                            </p>
                        </div>
                        <h3 className="mt-auto text-xl lg:text-2xl  font-medium capitalize text-zinc-200">
                            {category.title}
                        </h3>
                    </div>
                </Link>
            ))}
        </>
    );
};

export default CategoriesCard;
