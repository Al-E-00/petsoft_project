'use client';

import { usePetContext } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function PetList() {
  const { pets, selectedPetId, handleChangeSelectedPetId } = usePetContext();
  return (
    <ul className="gap-3 border-b border-black/[0.08] bg-white">
      {pets.map(pet => (
        <li key={pet.id}>
          <button
            onClick={() => handleChangeSelectedPetId(pet.id)}
            className={cn(
              `flex h-[4.375rem] w-full
              cursor-pointer items-center gap-3 px-5
              text-base transition hover:bg-[#EFF1F2] focus:bg-[#EFF1F2]`,
              {
                'bg-[#EFF1F2]': selectedPetId === pet.id,
              }
            )}
          >
            <Image src={pet.imageUrl} alt="Pet image" width={45} height={45} className="h-[45px] w-[45px] rounded-full object-cover" />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
