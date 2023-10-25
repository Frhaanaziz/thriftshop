import { Checkbox } from '@components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronsUpDown, MoreHorizontal } from 'lucide-react';
import { ColumnDef, Row } from '@tanstack/react-table';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Products } from '@types';
import { formatDate } from '@lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { deleteProductAction } from '@app/_actions/product';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const columns: ColumnDef<Products['Row']>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    size="sm"
                    className="text-xs"
                >
                    Name
                    <ChevronsUpDown className="ml-2 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'category',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    size="sm"
                    className="text-xs"
                >
                    Category
                    <ChevronsUpDown className="ml-2 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="text-xs font-bold border flex justify-center items-center rounded px-2 py-1">
                {row.getValue('category')}
            </div>
        ),
    },
    {
        accessorKey: 'price',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    size="sm"
                    className="text-xs"
                >
                    Price
                    <ChevronsUpDown className="ml-2 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue('price')}</div>,
    },
    {
        accessorKey: 'inventory',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    size="sm"
                    className="text-xs"
                >
                    Inventory
                    <ChevronsUpDown className="ml-2 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue('inventory')}</div>,
    },
    {
        accessorKey: 'rating',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    size="sm"
                    className="text-xs"
                >
                    Rating
                    <ChevronsUpDown className="ml-2 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue('rating')}</div>,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    size="sm"
                    className="text-xs"
                >
                    Created At
                    <ChevronsUpDown className="ml-2 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{formatDate(row.getValue('created_at'))}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionCell row={row} />,
    },
];

function ActionCell({ row }: { row: Row<Products['Row']> }) {
    const product = row.original;
    const router = useRouter();
    const supabase = createClientComponentClient();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href={`products/${product.id}`}>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                </Link>
                <Link href={`/product/${product.id}`}>
                    <DropdownMenuItem>View</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={async () => {
                        const { author_id, id, store_id } = product;
                        const deleteProducts = deleteProductAction({
                            supabase,
                            input: { author_id, id, store_id },
                        });

                        toast.promise(deleteProducts, {
                            loading: 'Deleting...',
                            success: 'Product deleted successfully',
                            error: 'Something wrong, please try again',
                        });

                        router.refresh();
                    }}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
