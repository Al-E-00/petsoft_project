import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './server-utils';
import { authSchema } from './validations';

const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // Runs on login

        // Validate the object
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }

        const { email, password } = validatedFormData.data;

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
        if (
          request.nextUrl.pathname.includes('/login') ||
          request.nextUrl.pathname.includes('/signup')
        ) {
          return Response.redirect(new URL('/payment', request.nextUrl));
        }

        return true;
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

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
