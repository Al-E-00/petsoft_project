import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import loadingSpinner from '@/assets/loading_spinner.svg';
import Image from 'next/image';

type PetFormBtnProps = {
  actionType: 'add' | 'edit';
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-5 self-end" type="submit" disabled={pending}>
      <span className="mr-3">{actionType === 'edit' ? 'Save' : 'Add a new pet'}</span>
      {pending && (
        <Image
          src={loadingSpinner}
          alt="Loading spinner"
          className="inline-block h-4 w-4 animate-spin"
        />
      )}
    </Button>
  );
}
