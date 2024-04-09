import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';
import { Toaster } from '@/components/ui/sonner';
import PetContextProvider from '@/context/pet-context-provider';
import SearchContextProvider from '@/context/search-context-provider';
import prisma from '@/lib/db';
import checkAuth from '@/lib/server-utils';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await checkAuth();

  const pets = await prisma.pet.findMany({
    where: {
      userId: session.user.id,
    },
  });

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

      <Toaster position="top-right" />
    </>
  );
}
