'use client';

import { useState } from 'react';

import PetForm from './pet-form';

import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';

import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from './ui/dialog';
import { flushSync } from 'react-dom';

type PetButtonProps = {
  actionType: 'add' | 'edit' | 'checkout';
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

export default function PetButton({ actionType, disabled, onClick, children }: PetButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  switch (actionType) {
    case 'checkout':
      return (
        <Button disabled={disabled} variant="secondary" onClick={onClick}>
          {children}
        </Button>
      );

    case 'add':
    case 'edit':
      return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            {actionType === 'add' ? (
              <Button size="icon">
                <PlusIcon className="h-6 w-6" />
              </Button>
            ) : (
              <Button variant="secondary">{children}</Button>
            )}
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionType === 'edit' ? 'Edit pet' : 'Add  a new pet'}</DialogTitle>
            </DialogHeader>

            <PetForm
              actionType={actionType}
              onFormSubmission={() =>
                flushSync(() => {
                  setIsFormOpen(false);
                })
              }
            />
          </DialogContent>
        </Dialog>
      );
  }
}
