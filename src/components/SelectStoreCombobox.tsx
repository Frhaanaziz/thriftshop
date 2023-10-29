'use client';

import { Check, ChevronsUpDown, Circle, PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Stores } from '@types';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@database/database.types';

type SelectStoreComboboxProps = {
    stores: Stores['Row'][];
    currentStore: Stores['Row'];
};

const SelectStoreCombobox = ({ stores, currentStore }: SelectStoreComboboxProps) => {
    const supabase = createClientComponentClient<Database>();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(currentStore.name);
    const router = useRouter();

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-start"
                >
                    <span>
                        <Circle className="w-4 h-4" />
                    </span>
                    <span className="truncate mx-2 capitalize">{value}</span>
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search store..." />
                    <CommandEmpty>No store found.</CommandEmpty>
                    <CommandGroup>
                        {stores.map((store) => (
                            <CommandItem
                                key={store.id}
                                onSelect={async (currentValue) => {
                                    setValue(currentValue === value ? value : currentValue);
                                    setOpen(false);
                                    const { data } = await supabase
                                        .from('stores')
                                        .select('id')
                                        .match({ author_id: store.author_id, name: store.name })
                                        .single();

                                    if (currentValue !== value) router.push(`/dashboard/stores/${data?.id}`);
                                }}
                            >
                                <span>
                                    <Circle className="mr-2 h-4 w-4 " />
                                </span>
                                <span className="truncate">{store.name}</span>
                                <span className="ml-auto">
                                    <Check
                                        className={cn(
                                            'h-4 w-4',
                                            value === store.name ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                        <Link href="/dashboard/stores/new">
                            <CommandItem
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? '' : currentValue);
                                    setOpen(false);
                                }}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create store
                            </CommandItem>
                        </Link>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default SelectStoreCombobox;
