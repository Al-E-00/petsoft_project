import { Button } from './ui/button';

type PetFormBtnProps = {
  actionType: 'add' | 'edit';
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  return (
    <Button className="mt-5 self-end" type="submit">
      <span>{actionType === 'edit' ? 'Save' : 'Add a new pet'}</span>
    </Button>
  );
}
