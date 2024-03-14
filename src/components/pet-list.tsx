import Image from 'next/image';

export default function PetList() {
  return (
    <ul className="gap-3 border-b border-black/[0.08] bg-white">
      <li>
        <button
          className="flex h-[4.375rem] w-full
          cursor-pointer items-center gap-3 px-5
          text-base transition hover:bg-[#EFF1F2] focus:bg-[#EFF1F2]"
        >
          <Image
            src="https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
            alt="Pet image"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <p className="font-semibold">Benjamin</p>
        </button>
      </li>
    </ul>
  );
}
