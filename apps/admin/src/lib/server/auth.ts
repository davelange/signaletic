import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { redirect, type Handle } from '@sveltejs/kit';

console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

export const {
  handle: authProvider,
  signIn,
  signOut
} = SvelteKitAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ]
});

export const authHandle: Handle = async ({ event, resolve }) => {
  const session = await event.locals.auth();

  if (!event.url.pathname.startsWith('/signin') && !session) {
    throw redirect(303, '/auth/signin');
  }

  if (event.url.pathname.startsWith('/auth/signin') && session) {
    throw redirect(303, '/');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (event.locals as any).session = session;

  return resolve(event);
};
