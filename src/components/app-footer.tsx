import Link from 'next/link';

export default function AppFooter() {
  return (
    <footer className="mt-auto border-t border-black/5 py-5">
      <small className="opacity-50">
        &copy; 2030
        <Link className="color hover:underline" href="https://alessio-m.vercel.app/">
          {' '}
          Alessio M.
        </Link>{' '}
        All rights reserved
      </small>
    </footer>
  );
}
