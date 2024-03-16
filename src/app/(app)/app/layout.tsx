import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';
import PetContextProvider from '@/context/pet-context-provider';
import SearchContextProvider from '@/context/search-context-provider';
import prisma from '@/lib/db';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const pets = await prisma.pet.findMany();

  return (
    <>
      <BackgroundPattern />

      <div className="mx-auto flex min-h-screen max-w-[65.625rem] flex-col px-4">
        <AppHeader />

        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>

        <AppFooter />
      </div>
    </>
  );
}
