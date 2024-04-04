'use server';

import prisma from '@/lib/db';
import { Pet } from '@prisma/client';
import { PetEssentials } from '@/lib/types';

import { sleep } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { petFormSchema, petIdSchema } from '@/lib/validations';

// When we get data from the client, we are not sure what it will be, so we use the unknown type.
export async function addPet(pet: unknown) {
  await sleep(1000);

  const validatedPet = petFormSchema.safeParse(pet);

  if (!validatedPet.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    console.error('addPet ~ error:', error);

    return {
      message: 'Could not add pet',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.update({
      where: { id: validatedPetId.data },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: 'Could not edit pet',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function deletePet(petId: unknown) {
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.delete({
      where: { id: validatedPetId.data },
    });
  } catch (error) {
    return {
      message: 'Could not delete pet',
    };
  }

  revalidatePath('/app', 'layout');
}
