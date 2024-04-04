'use client';

import { useState, createContext, useOptimistic } from 'react';

import { Pet } from '@prisma/client';
import { PetEssentials } from '@/lib/types';
import { addPet, deletePet, editPet } from '@/actions/actions';
import { toast } from 'sonner';

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet['id'] | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet['id'], newPetData: PetEssentials) => Promise<void>;
  handleCheckoutPet: (petId: Pet['id']) => Promise<void>;
  handleChangeSelectedPetId: (id: Pet['id']) => void;
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
  const [selectedPetId, setSelectedPetId] = useState<Pet['id'] | null>(null);

  // derived state
  const selectedPet = optimisticPets.find(pet => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers / actions
  const handleAddPet = async (newPet: PetEssentials) => {
    setOptimisticPets({ action: 'add', payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.error(error.message);
      return;
    }
  };

  const handleEditPet = async (petId: Pet['id'], newPetData: PetEssentials) => {
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

  const handleCheckoutPet = async (petId: Pet['id']) => {
    setOptimisticPets({ action: 'delete', payload: petId });
    const error = await deletePet(petId);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: Pet['id']) => {
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
