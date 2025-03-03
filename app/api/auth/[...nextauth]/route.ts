// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

/**
 * We define which permissions we need from Spotify. 
 * These will be requested during the OAuth flow.
 */
const scopes = [
  "user-read-email",
  "user-library-read",
  "user-read-recently-played",
  "user-read-private",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "user-read-playback-state",
  "user-modify-playback-state"
].join(" ");

/**
 * The main NextAuth configuration object.
 */
export const authOptions: NextAuthOptions = {
  // Providers define how users can log in. Here we use SpotifyProvider.
  providers: [
    SpotifyProvider({
      // The clientId and clientSecret come from your Spotify Developer app settings.
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      // We include our defined scopes in the authorization request.
      authorization: { params: { scope: scopes } },
    }),
  ],
  // NEXTAUTH_SECRET is used to encrypt the JWT token and session cookies.
  secret: process.env.NEXTAUTH_SECRET,

  // Callbacks let us modify the token or session.
  callbacks: {
    /**
     * jwt() is called whenever a token is created or updated.
     * 'account' is provided after the user first signs in.
     * We store the Spotify access and refresh tokens in 'token' for later use.
     */
    async jwt({ token, account }) {
      // If 'account' is defined, it means this is the first time the user is signing in.
      if (account) {
        token.accessToken = account.access_token;   // Spotify access token
        token.refreshToken = account.refresh_token; // Spotify refresh token
        token.expiresAt = account.expires_at;       // Token expiration timestamp
      }
      return token;
    },
    /**
     * session() is called whenever a session is checked/created.
     * We copy the token fields into the 'session' object so they're accessible in the client.
     */
    async session({ session, token }) {
      // Copy the accessToken, refreshToken, and expiresAt from the token into the session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      return session;
    },
  },
};

/**
 * We export NextAuth as a request handler for both GET and POST, 
 * following the Next.js 13 route convention.
 */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
