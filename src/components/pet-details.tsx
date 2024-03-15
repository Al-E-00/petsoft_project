'use client';

import { usePetContext } from '@/lib/hooks';
import Image from 'next/image';

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  return (
    <section className="flex h-full w-full flex-col">
      <div className="flex items-center border-b border-black/[0.08] bg-white px-8 py-5">
        <Image
          src={selectedPet?.imageUrl}
          alt="Selected pet image"
          height={75}
          width={75}
          className="h-[75px] w-[75px] rounded-full object-cover"
        />
        <h2 className="ml-5 text-3xl font-semibold leading-7">{selectedPet?.name}</h2>
      </div>

      <div className="flex justify-around px-5 py-10 text-center">
        <div>
          <h3 className="text-[.8125rem] font-medium uppercase text-zinc-700">Owner name</h3>
          <p className="mt-1 text-lg text-zinc-700">{selectedPet?.ownerName}</p>
        </div>
        <div>
          <h3 className="text-[.8125rem] font-medium uppercase text-zinc-700">Age</h3>
          <p className="mt-1 text-lg text-zinc-700">{selectedPet?.age}</p>
        </div>
      </div>

      <section className="mx-8 mb-9 flex-1 rounded-md border border-black/[0.08] bg-white px-7 py-5">{selectedPet?.notes}</section>
    </section>
  );
}
