'use client';

import { Pet } from '@/lib/types';
import { useState, createContext } from 'react';

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

export const PetContext = createContext(null);

export default function PetContextProvider({ children, data }: PetContextProviderProps) {
  const [pets, setPets] = useState<Pet[]>(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  return <PetContext.Provider value={{ pets, selectedPetId }}>{children}</PetContext.Provider>;
}
