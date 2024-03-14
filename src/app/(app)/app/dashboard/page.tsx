import Branding from '@/components/branding';
import ContentBlock from '@/components/content-block';
import PetDetails from '@/components/pet-details';
import PetList from '@/components/pet-list';
import SearchForm from '@/components/search-form';
import Stats from '@/components/stats';

export default function DashboardPage() {
  return (
    <main>
      <div className='flex items-center justify-between text-white py-8'>
        <Branding />

        <Stats />
      </div>

      <div className='grid grid-cols-3 grid-rows-[2.8125rem_1fr] gap-4 h-[37.5rem]'>
        <div className='row-start-1 row-span-1 col-start-1 col-span-1'>
          <SearchForm />
        </div>

        <div className='row-start-2 row-span-full col-start-1 col-span-1'>
          <ContentBlock>
            <PetList />
          </ContentBlock>
        </div>

        <div className='row-start-1 row-span-full col-start-2 col-span-full'>
          <ContentBlock>
            <PetDetails />
          </ContentBlock>
        </div>
      </div>
    </main>
  );
}
