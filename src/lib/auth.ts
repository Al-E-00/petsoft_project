import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './server-utils';

const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // Runs on login
        const { email, password } = credentials;

        const user = await getUserByEmail(email);

        if (!user) {
          console.log('User not found');
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatch) {
          console.log('Invalid credentials');
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // Runs on every request with middleware
      const isLoggedIn = !!auth?.user;
      const isTryingToAccessApp = request.nextUrl.pathname.includes('/app');

      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }

      if (isLoggedIn && !isTryingToAccessApp) {
        return Response.redirect(new URL('/app/dashboard', request.nextUrl));
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      return false;
    },
    jwt: ({ token, user }) => {
      if (user) {
        // On sign in
        if (user.id) {
          token.userId = user.id;
        }
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
