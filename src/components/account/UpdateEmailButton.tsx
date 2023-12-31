'use client';
import { Button } from '@components/ui/button';
import { Database } from '@database/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Profiles } from '@types';
import { FormEvent, useId, useState } from 'react';

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
import { absoluteUrl, catchError } from '@lib/utils';

type UpdateNameButtonProps = {
    profile: Profiles['Row'];
};

const UpdateEmailButton = ({ profile }: UpdateNameButtonProps) => {
    const [changedEmail, setChangedEmail] = useState<string>(profile?.email);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const supabase = createClientComponentClient<Database>();

    const id = useId();

    async function handleUpdateProfileEmail(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsOpen(false);

        try {
            setIsUpdating(true);
            toast.loading('Updating email', { id });

            const result = await supabase.auth.updateUser(
                { email: changedEmail },
                {
                    emailRedirectTo: absoluteUrl(
                        `/api/auth/updateEmail?newEmail=${changedEmail}&userId=${profile.user_id}`
                    ),
                }
            );
            if (result.error) throw result.error;

            toast.success('Check your new email for confirmation', { id });
        } catch (error) {
            catchError(error, id);
        } finally {
            setIsUpdating(false);
        }
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
                    <DialogTitle>Edit profile email</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile email here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateProfileEmail}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="name"
                                className="text-right"
                            >
                                Email
                            </Label>
                            <Input
                                id="name"
                                type="email"
                                value={changedEmail}
                                disabled={isUpdating}
                                onChange={(e) => setChangedEmail(e.target.value)}
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

export default UpdateEmailButton;
