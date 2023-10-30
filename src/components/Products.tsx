import ProductCard from '@components/cards/ProductCard';
import CategoriesPagination from './CategoriesPagination';
import { Products } from '@types';

type Props = {
    pageCount: number;
    products: Products['Row'][] | null;
};

const Products = ({ pageCount, products }: Props) => {
    if (!products || products.length === 0)
        return (
            <div className="py-10">
                <h2 className="text-center text-2xl font-bold">No products found</h2>
                <p className="text-center text-muted-foreground">
                    Try changing your filters, or check back later for new products
                </p>
            </div>
        );

    return (
        <>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-7">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            <CategoriesPagination
                products={products}
                pageCount={pageCount}
            />
        </>
    );
};

export default Products;
