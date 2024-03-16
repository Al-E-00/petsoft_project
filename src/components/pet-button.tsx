import React from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';

type PetButtonProps = {
  actionType: 'add' | 'edit' | 'checkout';
  onClick?: () => void;
  children?: React.ReactNode;
};

export default function PetButton({ actionType, onClick, children }: PetButtonProps) {
  switch (actionType) {
    case 'add':
      return (
        <Button size="icon">
          <PlusIcon className="h-6 w-6" />
        </Button>
      );
    case 'edit':
      return <Button variant="secondary">{children}</Button>;
    case 'checkout':
      return (
        <Button variant="secondary" onClick={onClick}>
          {children}
        </Button>
      );
  }
}
