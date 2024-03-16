'use client';

import { Pet } from '@/lib/types';
import { useState, createContext } from 'react';

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleCheckoutPet: (id: string) => void;
  handleChangeSelectedPetId: (id: string) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({ children, data }: PetContextProviderProps) {
  // state
  const [pets, setPets] = useState<Pet[]>(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find(pet => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers / actions
  const handleCheckoutPet = (id: string) => {
    setPets(prev => prev.filter(pet => pet.id !== id));
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider value={{ pets, selectedPetId, selectedPet, numberOfPets, handleCheckoutPet, handleChangeSelectedPetId }}>
      {children}
    </PetContext.Provider>
  );
}
