'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@components/ui/textarea';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Stores } from '@types';
import DeleteStoreButton from './DeleteStoreButton';
import { useRouter } from 'next/navigation';
import { updateStoreSchema } from '@lib/validations/store';
import { deleteStoreAction, updateStoreAction } from '@app/_actions/store';
import { catchError } from '@lib/utils';

type UpdateStoreCardProps = {
    currentStore: Stores['Row'];
};

const UpdateStoreCard = ({ currentStore }: UpdateStoreCardProps) => {
    const { author_id, description, id, name } = currentStore;

    const router = useRouter();

    const form = useForm<z.infer<typeof updateStoreSchema>>({
        resolver: zodResolver(updateStoreSchema),
        defaultValues: {
            name,
            description: description ?? '',
        },
    });
    const { handleSubmit, control } = form;

    async function onSubmit(formData: z.infer<typeof updateStoreSchema>) {
        try {
            await updateStoreAction({ input: { ...formData, author_id, id } });

            toast.success('Successfully update your store');
        } catch (error) {
            catchError(error);
        }
    }

    async function handleDeleteStore() {
        try {
            await deleteStoreAction({ input: { id, author_id } });

            router.replace('/dashboard/stores');
            toast.success('Successfully deleted your store');
        } catch (error) {
            catchError(error);
        }
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Update your store</CardTitle>
                        <CardDescription>
                            Update your store name and description, or delete it
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Type store name here."
                                                className="max-w-screen-sm"
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
                                                placeholder="Type store description here."
                                                className="max-w-screen-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="space-x-2">
                        <Button size="sm">Update store</Button>
                        <DeleteStoreButton handleDeleteStore={handleDeleteStore} />
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default UpdateStoreCard;
