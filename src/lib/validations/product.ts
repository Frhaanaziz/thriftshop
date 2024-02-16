import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  categories,
  sub_category,
} from '@lib/constant';
import z from 'zod';

export const newProductSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Must be at least 1 character',
    }),
    description: z.string().optional(),
    category: z.enum(categories, {
      invalid_type_error: 'Category must match those provided',
      required_error: 'Category is required',
    }),
    sub_category: z.string(),
    price: z.coerce
      .number({ invalid_type_error: 'Expected number, received nan' })
      .min(0, { message: 'Price cannot less than 0' }),
    inventory: z.coerce
      .number({ invalid_type_error: 'Expected number, received nan' })
      .min(0, { message: 'Inventory cannot be less than 0' }),
    image: z
      .any()
      .refine(
        (files: File[]) => files?.length <= 3,
        'Cannot upload more than 3 files'
      )
      .refine(
        (files) =>
          files.length === 0 ||
          files.reduce((acc: number, file: File) => acc + file.size, 0) <=
            MAX_FILE_SIZE,

        `Max total file size is 5MB.`
      )
      .refine((files) => {
        return (
          files.length === 0 ||
          files?.some((file: File) => ACCEPTED_IMAGE_TYPES.includes(file.type))
        );
      }, '.jpg, .jpeg, .png and .webp files are accepted.')
      .optional(),
  })
  .superRefine(({ category, sub_category: subCategoryForm }, ctx) => {
    let isValid = false;
    categories.forEach((catego, i) => {
      if (
        category === catego &&
        sub_category.at(i)?.includes(subCategoryForm)
      ) {
        isValid = true;
      }
    });

    if (!isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Subcategory must match the category',
        path: ['sub_category'],
      });
    }
  });

export const updateProductSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Must be at least 1 character',
    }),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    sub_category: z.string(),
    price: z.coerce
      .number({ invalid_type_error: 'Expected number, received nan' })
      .min(0, { message: 'Price cannot less than 0' }),
    inventory: z.coerce
      .number({ invalid_type_error: 'Expected number, received nan' })
      .min(0, { message: 'Inventory cannot be less than 0' }),
    image: z
      .any()
      .refine(
        (files: File[]) => files?.length <= 3,
        'Cannot upload more than 3 files'
      )
      .refine(
        (files) =>
          files.length === 0 ||
          files.reduce((acc: number, file: File) => acc + file.size, 0) <=
            MAX_FILE_SIZE,

        `Max total file size is 5MB.`
      )
      .refine((files) => {
        return (
          files.length === 0 ||
          files?.some((file: File) => ACCEPTED_IMAGE_TYPES.includes(file.type))
        );
      }, '.jpg, .jpeg, .png and .webp files are accepted.')
      .optional(),
  })
  .superRefine(({ category, sub_category: subCategoryForm }, ctx) => {
    let isValid = false;
    categories.forEach((catego, i) => {
      if (
        category === catego &&
        sub_category.at(i)?.includes(subCategoryForm)
      ) {
        isValid = true;
      }
    });

    if (!isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Subcategory must match the category',
        path: ['sub_category'],
      });
    }
  });
