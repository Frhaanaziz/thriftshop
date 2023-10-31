'use client';
import { Button } from '@components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog';
import { Separator } from '@components/ui/separator';
import { useId, useState } from 'react';
import toast from 'react-hot-toast';

import Dropzone from 'react-dropzone';
import { Cloud, File } from 'lucide-react';

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
import { deleteAvatarAction, updateProfileAction } from '@app/_actions/user';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@database/database.types';
import { Profiles } from '@types';
import { catchError } from '@lib/utils';

const UpdateProfileButton = ({ profile }: { profile: Profiles['Row'] }) => {
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const removeAvatar = () => {
        toast.promise(deleteAvatarAction({ profile }), {
            loading: 'Deleting avatar...',
            success: 'Avatar deleted successfully',
            error: 'Failed to delete avatar',
        });
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(v) => {
                    if (!v) setIsOpen(v);
                }}
            >
                <DialogTrigger
                    onClick={() => setIsOpen(true)}
                    disabled={isUploading}
                    asChild
                >
                    <Button size="sm">Update</Button>
                </DialogTrigger>

                <DialogContent>
                    <UploadDropzone
                        profile={profile}
                        isUploading={(isUploading) => {
                            setIsUploading(isUploading);
                            if (!isUploading) setIsOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Separator orientation="vertical" />

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        type="button"
                        size="sm"
                        disabled={isUploading || !profile.avatar_url}
                    >
                        Remove
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your avatar and remove
                            your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={removeAvatar}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default UpdateProfileButton;

const supabase = createClientComponentClient<Database>();

const UploadDropzone = ({
    profile,
    isUploading,
}: {
    profile: Profiles['Row'];
    isUploading: (isUploading: boolean) => void;
}) => {
    const id = useId();

    return (
        <Dropzone
            multiple={false}
            onDrop={async (acceptedFile) => {
                try {
                    isUploading(true);
                    toast.loading('Uploading avatar...', { id });

                    if (!acceptedFile || acceptedFile.length === 0) {
                        throw new Error('You must select an image to upload.');
                    }

                    const file = acceptedFile.at(0)!;

                    if (profile.avatar_url) await deleteAvatarAction({ profile });

                    const fileExt = file.name.split('.').pop();
                    const filePath = `${profile.user_id}-${Math.random()}.${fileExt}`;

                    const result = await supabase.storage.from('avatars').upload(filePath, file);
                    if (result.error) throw result.error;

                    await updateProfileAction({
                        profile,
                        filePath,
                    });

                    toast.success('Avatar updated!', { id });
                } catch (error: unknown) {
                    if (error instanceof Error) catchError(error, id);
                } finally {
                    isUploading(false);
                }
            }}
        >
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div
                    {...getRootProps()}
                    className="border h-64 m-4 border-dashed border-foreground rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-center h-full w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center h-full w-full rounded-lg cursor-pointer bg-background hover:bg-muted transition"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Cloud className="h-6 w-6  mb-2" />
                                <p className="mb-2 text-sm ">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                            </div>

                            {acceptedFiles && acceptedFiles.at(0) ? (
                                <div className="max-w-xs  flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                                    <div className="px-3 py-2 h-full grid place-items-center">
                                        <File className="h-4 w-4 text-blue-500" />
                                    </div>

                                    <div className="px-3 py-2 h-full text-sm truncate">
                                        {acceptedFiles?.at(0)?.name}
                                    </div>
                                </div>
                            ) : null}

                            <input
                                type="file"
                                id="dropzone-file"
                                className="hidden"
                                {...getInputProps()}
                            />
                        </label>
                    </div>
                </div>
            )}
        </Dropzone>
    );
};
