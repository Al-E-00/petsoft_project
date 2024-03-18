'use client';

import { useState, createContext, useOptimistic } from 'react';

import { Pet } from '@/lib/types';
import { addPet, deletePet, editPet } from '@/actions/actions';
import { toast } from 'sonner';

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleAddPet: (newPet: Omit<Pet, 'id'>) => Promise<void>;
  handleEditPet: (petId: string, newPetData: Omit<Pet, 'id'>) => Promise<void>;
  handleCheckoutPet: (id: string) => Promise<void>;
  handleChangeSelectedPetId: (id: string) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({ children, data }: PetContextProviderProps) {
  // state
  const [optimisticPets, setOptimisticPets] = useOptimistic(data, (state, { action, payload }) => {
    switch (action) {
      case 'add':
        return [...state, { ...payload, id: Date.now().toString() }];
      case 'edit':
        return state.map(pet => (pet.id === payload.id ? { ...pet, ...payload.newPetData } : pet));
      case 'delete':
        return state.filter(pet => pet.id !== payload);
      default:
        return state;
    }
  });
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = optimisticPets.find(pet => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers / actions
  const handleAddPet = async (newPet: Omit<Pet, 'id'>) => {
    setOptimisticPets({ action: 'add', payload: newPet });

    const error = await addPet(newPet);
    if (error) {
      toast.error(error.message);
      return;
    }
  };

  const handleEditPet = async (petId: string, newPetData: Omit<Pet, 'id'>) => {
    setOptimisticPets({
      action: 'edit',
      payload: {
        id: petId,
        newPetData,
      },
    });

    const error = await editPet(petId, newPetData);

    if (error) {
      toast.error(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (id: string) => {
    setOptimisticPets({ action: 'delete', payload: id });

    await deletePet(id);

    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleAddPet,
        handleEditPet,
        handleCheckoutPet,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
