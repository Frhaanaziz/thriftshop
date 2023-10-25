import { Database } from '@db/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { type ClassValue, clsx } from 'clsx';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

// import { env } from "@/env.mjs"
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

export function formatNumber(
    number: number | string,
    options: {
        decimals?: number;
        style?: Intl.NumberFormatOptions['style'];
        notation?: Intl.NumberFormatOptions['notation'];
    } = {}
) {
    const { decimals = 0, style = 'decimal', notation = 'standard' } = options;

    return new Intl.NumberFormat('en-US', {
        style,
        notation,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(Number(number));
}

export function formatDate(date: Date | string | number) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

// export function formatBytes(
//   bytes: number,
//   decimals = 0,
//   sizeType: "accurate" | "normal" = "normal"
// ) {
//   const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
//   const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
//   if (bytes === 0) return "0 Byte"
//   const i = Math.floor(Math.log(bytes) / Math.log(1024))
//   return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
//     sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
//   }`
// }

// export function formatId(id: number) {
//   return `#${id.toString().padStart(4, "0")}`
// }

export function slugify(str: string) {
    return str
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

export function unslugify(str: string) {
    return str.replace(/-/g, ' ');
}

export function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export function toSentenceCase(str: string) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

export function isArrayOfFile(files: unknown): files is File[] {
    const isArray = Array.isArray(files);
    if (!isArray) return false;
    return files.every((file) => file instanceof File);
}

// export function absoluteUrl(path: string) {
//     return `${env.NEXT_PUBLIC_APP_URL}${path}`;
// }

export function catchError(err: unknown) {
    if (err instanceof z.ZodError) {
        const errors = err.issues.map((issue) => {
            return issue.message;
        });
        return toast.error(errors.join('\n'));
    } else if (err instanceof Error) {
        return toast.error(err.message);
    } else {
        return toast.error('Something went wrong, please try again later.');
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

type uploadProductImagesProps = {
    supabase: SupabaseClient<Database>;
    files: File[];
    storeId: string;
};
