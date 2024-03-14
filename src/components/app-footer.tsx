import Link from 'next/link';
import React from 'react';

export default function AppFooter() {
  return (
    <footer className='border-t border-black/5 py-5 mt-auto'>
      <small className='opacity-50'>
        &copy; 2030
        <Link
          className='hover:underline color'
          href='https://alessio-m.vercel.app/'
        >
          {' '}
          Alessio M.
        </Link>{' '}
        All rights reserved
      </small>
    </footer>
  );
}
