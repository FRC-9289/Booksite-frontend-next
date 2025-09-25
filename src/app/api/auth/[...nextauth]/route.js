// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // optional callbacks, session, etc.
};

// NextAuth handler
const handler = NextAuth(authOptions);

// **Named exports for each HTTP method**
export { handler as GET, handler as POST };
