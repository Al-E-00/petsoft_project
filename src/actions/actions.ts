'use server';

import prisma from '@/lib/db';

export async function addPet(formData) {
  const pet = {
    name: formData.get('name'),
    ownerName: formData.get('ownerName'),
    imageUrl: formData.get('imageUrl'),
    age: parseInt(formData.get('age')),
    notes: formData.get('notes'),
  };

  await prisma.pet.create({
    data: pet,
  });
}
