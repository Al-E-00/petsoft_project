import { z } from 'zod';
import { DEFAULT_PET_IMAGE_URL } from './constants';

export const petFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Name is required' })
      .max(100, { message: 'Name is too long' }),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: 'Owner name is required' })
      .max(100, { message: 'Owner name is too long' }),
    imageUrl: z.union([z.literal(''), z.string().trim().url({ message: 'Invalid image URL' })]),
    age: z.coerce
      .number()
      .int()
      .positive({ message: 'Age must be a positive number' })
      .max(50, { message: 'Age must be less than 50' }),
    notes: z.union([
      z.literal(''),
      z.string().trim().max(500, { message: 'Notes must be less than 500 characters' }),
    ]),
  })
  .transform(data => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE_URL,
  }));

export type TPetForm = z.infer<typeof petFormSchema>;
