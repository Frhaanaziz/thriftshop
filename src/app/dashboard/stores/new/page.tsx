'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@components/ui/textarea';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@db/database.types';
import { getSession } from '@lib/getSession';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { newStoreSchema } from '@lib/validations/store';
import { addStoreAction } from '@app/_actions/store';
import { catchError } from '@lib/utils';

const NewStorePage = () => {
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();

    const form = useForm<z.infer<typeof newStoreSchema>>({
        resolver: zodResolver(newStoreSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });
    const { handleSubmit, control, reset } = form;

    async function onSubmit({ name, description }: z.infer<typeof newStoreSchema>) {
        reset();
        try {
            const {
                data: { session },
            } = await getSession({ supabase });
            if (!session) throw new Error('Session not found');

            const author_id = session.user.id;
            await addStoreAction({ supabase, input: { author_id, name, description } });

            router.push('/dashboard/stores');
            router.refresh();
            toast.success('Successfully create your store');
        } catch (error) {
            catchError(error);
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">New Store</h1>
            <p className="text-muted-foreground my-1">Add new store to your account</p>

            <Card className="max-w-screen-md my-8">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle>Add store</CardTitle>
                            <CardDescription>Add a new store to your account</CardDescription>
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
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                type="submit"
                                size="sm"
                            >
                                Add Store
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default NewStorePage;
