import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteStoreAction } from '@app/_actions/store';
import { catchError } from '@lib/utils';
import { Stores } from '@types';
import { useId, useTransition } from 'react';
import toast from 'react-hot-toast';

const DeleteStoreButton = ({ id, author_id, disabled }: Pick<Stores['Row'], 'id' | 'author_id'> & { disabled: boolean }) => {
    const toastId = useId();
    const [isDeleting, startTransition] = useTransition();

    function handleDeleteStore() {
        startTransition(async () => {
            try {
                toast.loading('Deleting your store...', { id: toastId });

                await deleteStoreAction({ input: { id, author_id } });

                toast.success('Successfully deleted your store', { id: toastId });
            } catch (error) {
                catchError(error, toastId);
            }
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={disabled || isDeleting}
                >
                    Delete store
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your store and remove your
                        data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteStore}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteStoreButton;
