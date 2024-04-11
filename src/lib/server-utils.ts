import 'server-only';

import { auth } from './auth';
import { redirect } from 'next/navigation';
import { Pet, User } from '@prisma/client';
import prisma from './db';

export default async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return session;
}

// --- user actions ---
export async function getUserByEmail(userEmail: User['email']) {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  return user;
}

// --- pet actions ---
export async function getPetById(petId: Pet['id']) {
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    select: { userId: true },
  });

  return pet;
}

export async function getPetsByUserId(userId: User['id']) {
  const pets = await prisma.pet.findMany({
    where: {
      userId: userId,
    },
  });

  return pets;
}
