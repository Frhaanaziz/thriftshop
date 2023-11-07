'use client';
import { Button } from '@components/ui/button';
import { Profiles } from '@types';
import { FormEvent, useId, useState, useTransition } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@components/ui/dialog';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { updateProfileAction } from '@app/_actions/user';
import { catchError } from '@lib/utils';

type UpdateNameButtonProps = {
    profile: Profiles['Row'];
};

const UpdateNameButton = ({ profile }: UpdateNameButtonProps) => {
    const [changedName, setChangedName] = useState<string>(profile?.fullName);
    const [isUpdating, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const id = useId();

    async function handleUpdateProfileName(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsOpen(false);

        startTransition(async () => {
            try {
                toast.loading('Updating profile name...', { id });

                const result = await updateProfileAction({
                    profile: { ...profile, fullName: changedName },
                });
                if (result.error) throw new Error(result.error.message);

                toast.success('Update profile name successfully', { id });
            } catch (error) {
                catchError(error, id);
            }
        })
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(v) => setIsOpen(v)}
        >
            <DialogTrigger asChild>
                <Button
                    type="button"
                    size="sm"
                    disabled={isUpdating}
                >
                    Update
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile name</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile name here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateProfileName}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="name"
                                className="text-right"
                            >
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={changedName}
                                disabled={isUpdating}
                                onChange={(e) => setChangedName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isUpdating}
                        >
                            {isUpdating && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateNameButton;
