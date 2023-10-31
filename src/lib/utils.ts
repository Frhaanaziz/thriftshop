import { Database } from '@database/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { type ClassValue, clsx } from 'clsx';
import { env } from 'process';

import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

import * as z from 'zod';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(
    price: number | string,
    options: {
        currency?: 'USD' | 'EUR' | 'GBP' | 'BDT';
        notation?: Intl.NumberFormatOptions['notation'];
    } = {}
) {
    const { currency = 'USD', notation = 'compact' } = options;

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        notation,
    }).format(Number(price));
}

export function formatDate(date: Date | string | number) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

export function slugify(str: string) {
    return str
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

export function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export function toSentenceCase(str: string) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

export function absoluteUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function getErrorMessage(error: unknown) {
    let message: string;

    if (error instanceof Error) {
        message = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
        message = String(error.message);
    } else if (typeof error === 'string') {
        message = error;
    } else {
        message = 'Something went wrong, please try again later.';
    }

    return message;
}

export function catchError(err: unknown, toastId?: string) {
    if (err instanceof z.ZodError) {
        const errors = err.issues.map((issue) => {
            return issue.message;
        });
        return toast.error(errors.join('\n'), {
            id: toastId ?? '',
        });
    } else if (err instanceof Error) {
        return toast.error(err.message, {
            id: toastId ?? '',
        });
    } else {
        return toast.error('Something went wrong, please try again later.', {
            id: toastId ?? '',
        });
    }
}

export async function uploadProductImages({ supabase, files, storeId }: uploadProductImagesProps) {
    const uploadPromises = files.map((file: File) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${storeId}-${Math.random()}.${fileExt}`;

        return supabase.storage.from('product_images').upload(filePath, file);
    });

    const results = await Promise.all(uploadPromises);
    if (results.some((result) => result.error))
        throw new Error('Something wrong when uploading product image');

    return results;
}

export function getInitials(name?: string) {
    if (!name || name.length === 0) return 'CN';

    const splitName = name.split(' ');

    if (splitName.length === 1) {
        return splitName[0].slice(0, 2).toUpperCase();
    } else {
        return (splitName[0][0] + splitName[1][0]).toUpperCase();
    }
}

export function isValidUUID(str: string) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return regex.test(str);
}

export async function checkImage(url: string | undefined) {
    if (!url) return false;

    const res = await fetch(url);
    const buff = await res.blob();

    return buff.type.startsWith('image/');
}

type uploadProductImagesProps = {
    supabase: SupabaseClient<Database>;
    files: File[];
    storeId: string;
};
