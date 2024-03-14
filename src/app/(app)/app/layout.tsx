import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundPattern />

      <div className='max-w-[65.625rem] mx-auto'>
        <AppHeader />
        {children}
        <AppFooter />
      </div>
    </>
  );
}
