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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@db/database.types';
import ImageUploadFormField from './ImageUploadFormField';
import toast from 'react-hot-toast';
import { notFound, useRouter } from 'next/navigation';
import { newProductSchema } from '@lib/validations/product';
import { categories, sub_category } from '@constant';
import { getUserAction } from '@app/_actions/user';
import { uploadProductAction, uploadProductImagesAction } from '@app/_actions/product';
import { catchError } from '@lib/utils';

const subCategoryValue = (value: string): string[] | undefined => {
    let subCategoryy: string[] | undefined;

    categories.forEach((category, i) => {
        if (category === value) {
            subCategoryy = sub_category.at(i);
        }
    });

    return subCategoryy;
};

const NewProductForm = ({ storeId: store_id }: { storeId: string }) => {
    const router = useRouter();
    const supabase = createClientComponentClient<Database>();

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

        const {
            data: { user },
        } = await getUserAction({ supabase });

        try {
            if (formData.image.length > 0) {
                const results = await uploadProductImagesAction({
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

            await uploadProductAction({
                supabase,
                input: {
                    author_id: user.id,
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

            reset();
            router.refresh();
            toast.success('Successfully create your product');
        } catch (error) {
            catchError(error);
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

                <CardFooter>
                    <Button type="submit">Add Product</Button>
                </CardFooter>
            </form>
        </Form>
    );
};

export default NewProductForm;
