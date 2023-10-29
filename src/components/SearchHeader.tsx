'use client';

import { useRouter } from 'next/navigation';

import { productCategories } from '@/config/products';
import { catchError, cn, toSentenceCase } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { useState, useTransition, useEffect, useCallback } from 'react';
import { filterProductsAction } from '@app/_actions/product';
import { Products } from '@types';
import { useDebounce } from '@hooks/useDebounce';

interface ProductGroup {
    category: Products['Row']['category'];
    products: Pick<Products['Row'], 'id' | 'name' | 'category'>[];
}

function SearchHeader() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query);
    const [data, setData] = useState<ProductGroup[] | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (debouncedQuery.length <= 0) {
            setData(null);
            return;
        }

        async function fetchData() {
            try {
                const data = await filterProductsAction(debouncedQuery);
                setData(data);
            } catch (err) {
                catchError(err);
            }
        }

        startTransition(fetchData);

        return () => setData(null);
    }, [debouncedQuery]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSelect = useCallback((callback: () => unknown) => {
        setOpen(false);
        callback();
    }, []);

    useEffect(() => {
        if (!open) {
            setQuery('');
        }
    }, [open]);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-10 w-10 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <Search
                    className="h-4 w-4 xl:mr-2"
                    aria-hidden="true"
                />
                <span className="hidden xl:inline-flex">Search products...</span>
                <span className="sr-only">Search products</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
                    <abbr
                        title="Control"
                        className="no-underline"
                    >
                        Ctrl
                    </abbr>
                    K
                </kbd>
            </Button>
            <CommandDialog
                // position="top"
                open={open}
                onOpenChange={setOpen}
            >
                <CommandInput
                    placeholder="Search products..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty className={cn(isPending ? 'hidden' : 'py-6 text-center text-sm')}>
                        No products found.
                    </CommandEmpty>
                    {isPending ? (
                        <div className="space-y-1 overflow-hidden px-1 py-2">
                            <Skeleton className="h-4 w-10 rounded" />
                            <Skeleton className="h-8 rounded-sm" />
                            <Skeleton className="h-8 rounded-sm" />
                        </div>
                    ) : (
                        data?.map((group) => (
                            <CommandGroup
                                key={group.category}
                                className="capitalize"
                                heading={group.category}
                            >
                                {group.products.map((item) => {
                                    const CategoryIcon =
                                        productCategories.find(
                                            (category) => toSentenceCase(category.title) === group.category
                                        )?.icon ?? 'circle';

                                    return (
                                        <CommandItem
                                            key={item.id}
                                            value={item.name}
                                            onSelect={() =>
                                                handleSelect(() => router.push(`/product/${item.id}`))
                                            }
                                        >
                                            <span className="truncate">{item.name}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        ))
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}

export default SearchHeader;
