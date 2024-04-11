'use server';

import prisma from '@/lib/db';

import { sleep } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { authSchema, petFormSchema, petIdSchema } from '@/lib/validations';
import { signIn } from '@/lib/auth';
import { signOut } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import checkAuth, { getPetById } from '@/lib/server-utils';
import { Prisma } from '@prisma/client';

// --- user actions ---
export async function logIn(formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data',
    };
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    return {
      message: 'Invalid credentials',
    };
  }

  redirect('/app/dashboard');
}

export async function logOut() {
  try {
    await signOut({ redirectTo: '/' });
  } catch (error) {
    return {
      message: 'Could not log out',
    };
  }
}

export async function signUp(formData: unknown) {
  // Check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data',
    };
  }

  // Convert formData to a plain object
  const formDataEntries = Object.fromEntries(formData.entries());

  // Validate
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: 'Invalid form data',
    };
  }

  const { email, password } = validatedFormData.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email: email,
        hashedPassword: hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          message: 'Email is already in use',
        };
      }
    }

    return {
      message: 'Could not sign up',
    };
  }

  await signIn('credentials', formData);
}

// --- pet actions ---
export async function addPet(pet: unknown) {
  await sleep(1000);

  // Authentication check
  const session = await checkAuth();

  // Validation
  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  // Database mutation
  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
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

  // Authentication check
  const session = await checkAuth();

  // Validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  // Authorization check (user owns pet)
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: 'Pet not found',
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: 'Not authorized to edit pet',
    };
  }

  // Database mutation
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

  //Authentication check
  const session = await checkAuth();

  //Validation
  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  //Authorization check (user owns pet)
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: 'Pet not found',
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: 'Not authorized to delete pet',
    };
  }

  //Database mutation
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
