'use server';

import prisma from '@/lib/db';

import { sleep } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { petFormSchema, petIdSchema } from '@/lib/validations';
import { auth, signIn } from '@/lib/auth';
import { signOut } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

// --- user actions ---

export async function logIn(formData: FormData) {
  await signIn('credentials', formData);

  redirect('/app/dashboard');
}

export async function logOut() {
  await signOut({ redirectTo: '/' });
}

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(formData.get('password') as string, 10);

  await prisma.user.create({
    data: {
      email: formData.get('email') as string,
      hashedPassword: hashedPassword,
    },
  });

  await signIn('credentials', formData);
}

// --- pet actions ---
export async function addPet(pet: unknown) {
  await sleep(1000);

  // Authentication check
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

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
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  // Validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  // Authorization check (user owns pet)
  const pet = await prisma.pet.findUnique({
    where: { id: validatedPetId.data },
    select: { userId: true },
  });

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
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  //Validation
  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  //Authorization check (user owns pet)
  const pet = await prisma.pet.findUnique({
    where: { id: validatedPetId.data },
    select: { userId: true },
  });

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
