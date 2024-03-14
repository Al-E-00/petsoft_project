import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='bg-[#5DC9A8] min-h-screen flex items-center justify-center gap-10 xl:flex-row flex-col'>
      <Image
        src='https://bytegrad.com/course-assets/react-nextjs/petsoft-preview.png'
        alt='Preview of PetSoft'
        height={519}
        width={472}
      />

      <div>
        <Logo />
        <h1 className='text-5xl font-semibold my-6 max-w-[31.25rem]'>
          Manage your <span className='font-extrabold'>pet daycare</span> with
          ease
        </h1>
        <p className='text-2xl font-medium max-w-[37.5rem]'>
          Use PetSoft to easily keep track of pets under your care. Get lifetime
          access for $299.
        </p>

        <div className='mt-10 space-x-3'>
          <Button asChild>
            <Link href='/signup'>Get Started</Link>
          </Button>
          <Button variant='secondary' asChild>
            <Link href='/login'>Log In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
