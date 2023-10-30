'use client';
import { Button } from '@components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Cloud, File } from 'lucide-react';
import { useState } from 'react';
import Dropzone from 'react-dropzone';

interface Props {
    control: any;
    setValue: any;
    isLoading: boolean;
}

const ImageUploadFormField = ({ control, setValue, isLoading }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <FormField
            control={control}
            name="image"
            render={({ field }) => (
                <>
                    <Dialog
                        open={isOpen}
                        onOpenChange={(v) => {
                            if (!v) setIsOpen(v);
                        }}
                    >
                        <DialogTrigger
                            onClick={() => setIsOpen(true)}
                            disabled={isLoading}
                            asChild
                        >
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-full border"
                            >
                                Upload Images
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <Dropzone
                                onDrop={async (acceptedFile) => {
                                    setValue('image', acceptedFile, { shoudValidate: true });
                                    setIsOpen(false);
                                }}
                            >
                                {({ getRootProps, getInputProps, acceptedFiles }) => (
                                    <div
                                        {...getRootProps()}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="border h-64 m-4 border-dashed border-foreground rounded-lg">
                                            <div className="flex items-center justify-center h-full w-full">
                                                <label
                                                    htmlFor="dropzone-file"
                                                    className="flex flex-col items-center justify-center h-full w-full rounded-lg cursor-pointer bg-background hover:bg-muted transition"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Cloud className="h-7 w-7  mb-2" />
                                                        <p className="mb-2 text-sm ">
                                                            <span className="font-semibold">
                                                                Click to upload
                                                            </span>{' '}
                                                            or drag and drop
                                                        </p>
                                                        <p className="mb-2 text-sm text-muted-foreground">
                                                            Please upload file with size less than 5 MB
                                                        </p>
                                                    </div>

                                                    {acceptedFiles.length > 0 ? (
                                                        <div className="max-w-xs  flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                                                            <div className="px-3 py-2 h-full grid place-items-center">
                                                                <File className="h-4 w-4 text-blue-500" />
                                                            </div>

                                                            <div className="px-3 py-2 h-full text-sm truncate">
                                                                {acceptedFiles.map((file) => file.name)}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="file"
                                                                id="dropzone-file"
                                                                className="hidden"
                                                                {...getInputProps()}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                </label>
                                            </div>
                                        </div>

                                        <p className="text-center text-muted-foreground">
                                            You can upload up to 3 files
                                        </p>
                                    </div>
                                )}
                            </Dropzone>
                        </DialogContent>
                    </Dialog>
                    <FormMessage />
                </>
            )}
        />
    );
};

export default ImageUploadFormField;
