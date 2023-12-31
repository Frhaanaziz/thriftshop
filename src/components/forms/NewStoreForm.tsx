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
import { newStoreSchema } from '@lib/validations/store';
import { addStoreAction } from '@app/_actions/store';
import { catchError } from '@lib/utils';
import { User } from '@supabase/supabase-js';
import { useId, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const NewStoreForm = ({ author_id }: { author_id: User['id'] }) => {
    const id = useId();
    const router = useRouter();
    const [isSubmitting, startTransition] = useTransition();

    const form = useForm<z.infer<typeof newStoreSchema>>({
        resolver: zodResolver(newStoreSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });
    const { handleSubmit, control, reset } = form;

    function onSubmit({ name, description }: z.infer<typeof newStoreSchema>) {
        startTransition(async () => {
            try {
                toast.loading('Creating your store...', { id });

                const result = await addStoreAction({ input: { author_id, name, description } });
                if (result.error) throw new Error(result.error.message);

                reset();
                toast.success('Successfully create your store', { id });
                router.push('/dashboard/stores');
            } catch (error) {
                catchError(error, id);
            }
        })
    }

    return (
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                            Add Store
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default NewStoreForm;
