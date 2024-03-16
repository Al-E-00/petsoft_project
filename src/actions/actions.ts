'use server';

import prisma from '@/lib/db';
import { sleep } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function addPet(formData) {
  await sleep(1000);

  const pet = {
    name: formData.get('name'),
    // ownerName: formData.get('ownerName'),
    imageUrl:
      formData.get('imageUrl') ||
      'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
    age: parseInt(formData.get('age')),
    notes: formData.get('notes'),
  };

  try {
    await prisma.pet.create({
      data: pet,
    });
  } catch (error) {
    return {
      message: 'Could not add pet',
    };
  }

  revalidatePath('/app', 'layout');
}
