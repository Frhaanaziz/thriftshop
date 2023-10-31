'use client';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@components/ui/button';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Textarea } from '@components/ui/textarea';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploadFormField from './ImageUploadFormField';
import toast from 'react-hot-toast';
import { newProductSchema } from '@lib/validations/product';
import { categories, sub_category } from '@lib/constant';
import { uploadProductAction } from '@app/_actions/product';
import { catchError, uploadProductImages } from '@lib/utils';
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@database/database.types';
import { useId, useState } from 'react';
import { Stores } from '@types';
import error from 'next/error';

const subCategoryValue = (value: string): string[] | undefined => {
    let subCategoryy: string[] | undefined;

    categories.forEach((category, i) => {
        if (category === value) {
            subCategoryy = sub_category.at(i);
        }
    });

    return subCategoryy;
};

const supabase = createClientComponentClient<Database>();

const NewProductForm = ({
    storeId: store_id,
    author_id,
}: {
    storeId: Stores['Row']['id'];
    author_id: User['id'];
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const id = useId();

    const form = useForm<z.infer<typeof newProductSchema>>({
        resolver: zodResolver(newProductSchema),
        defaultValues: {
            name: '',
            description: '',
            category: 'Clothing',
            sub_category: '',
            price: '' as unknown as number,
            inventory: '' as unknown as number,
            image: [],
        },
    });
    const { handleSubmit, control, watch, setValue, reset } = form;

    async function onSubmit(formData: z.infer<typeof newProductSchema>) {
        const { category, inventory, name, price, sub_category, description } = formData;
        let productImageUrl: string[] | null = null;

        try {
            setIsLoading(true);
            toast.loading('Creating your product', { id });

            if (formData.image.length > 0) {
                const results = await uploadProductImages({
                    supabase,
                    files: formData.image,
                    storeId: store_id,
                });

                productImageUrl = results.map(
                    (result) =>
                        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${
                            result.data!.path
                        }`
                );
            }

            const result = await uploadProductAction({
                input: {
                    author_id,
                    store_id,
                    category,
                    inventory,
                    name,
                    price,
                    sub_category,
                    description,
                    product_images: productImageUrl,
                },
            });
            if (result.error) throw new Error(result.error.message);

            reset();
            toast.success('Product created successfully', { id });
        } catch (error) {
            catchError(error, id);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className=" max-w-screen-sm"
            >
                <CardContent className="space-y-5">
                    <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Type product name here."
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Type product description here."
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-5 sm:space-y-0 sm:grid grid-cols-2 gap-6">
                        <FormField
                            control={control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger disabled={isLoading}>
                                                <SelectValue defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="sub_category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subcategory</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger disabled={isLoading}>
                                                <SelectValue placeholder="Select a subcategory" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subCategoryValue(watch('category'))?.map((category) => (
                                                <SelectItem
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Type product price here."
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="inventory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inventory</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="Type product inventory here. (number)"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <ImageUploadFormField
                        control={control}
                        setValue={setValue}
                        isLoading={isLoading}
                    />
                </CardContent>

                <CardFooter>
                    <Button type="submit">Add Product</Button>
                </CardFooter>
            </form>
        </Form>
    );
};

export default NewProductForm;
