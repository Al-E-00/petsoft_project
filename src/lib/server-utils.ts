import { auth } from './auth';
import { redirect } from 'next/navigation';

export default async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return session;
}
