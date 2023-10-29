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
import { updateProductSchema } from '@lib/validations/product';
import { categories, sub_category } from '@lib/constant';
import { deleteProductAction, updateProductAction } from '@app/_actions/product';
import { Products } from '@types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { catchError, uploadProductImages } from '@lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@database/database.types';

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

const UpdateProductForm = ({ product }: { product: Products['Row'] }) => {
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof updateProductSchema>>({
        resolver: zodResolver(updateProductSchema),
        defaultValues: {
            name: product.name,
            description: product.description ?? '',
            category: product.category,
            sub_category: product.sub_category,
            price: product.price,
            inventory: product.inventory as unknown as number,
            image: [],
        },
    });
    const { handleSubmit, control, watch, setValue } = form;

    async function onSubmit(formData: z.infer<typeof updateProductSchema>) {
        const { category, inventory, name, price, sub_category, description } = formData;
        let productImageUrl: string[] | null = null;

        try {
            setIsUpdating(true);

            if (formData.image.length > 0) {
                const results = await uploadProductImages({
                    supabase,
                    files: formData.image,
                    storeId: product.store_id,
                });

                productImageUrl = results.map(
                    (result) =>
                        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${
                            result.data!.path
                        }`
                );
            }

            await updateProductAction({
                input: {
                    id: product.id,
                    author_id: product.author_id,
                    store_id: product.store_id,
                    category,
                    inventory,
                    name,
                    price,
                    sub_category,
                    description: description ?? '',
                    product_images: productImageUrl,
                },
            });

            toast.success('Successfully create your product');
        } catch (error) {
            catchError(error);
        } finally {
            setIsUpdating(false);
        }
    }

    async function handleDeleteProduct() {
        try {
            setIsDeleting(true);

            await deleteProductAction({
                input: {
                    author_id: product.author_id,
                    id: product.id,
                    store_id: product.store_id,
                },
                // path: `/dashboard/stores/${product.store_id}/products`,
            });

            router.replace(`/dashboard/stores/${product.store_id}/products`);
            toast.success('Product deleted successfully');
        } catch (error) {
            catchError(error);
        } finally {
            setIsDeleting(false);
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
                                            <SelectTrigger>
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
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={field.value}
                                                    defaultValue={field.value}
                                                />
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
                    />
                </CardContent>

                <CardFooter className="space-x-3">
                    <Button type="submit">Update Product</Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteProduct}
                    >
                        Delete Product
                    </Button>
                </CardFooter>
            </form>
        </Form>
    );
};

export default UpdateProductForm;
