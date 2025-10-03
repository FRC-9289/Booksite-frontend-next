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
  callbacks: {
    async redirect({ url, baseUrl, user }) {
      if (!user?.email) return baseUrl;

      if (user.email.endsWith('@s.thevillageschool.com')) {
        return `${baseUrl}/student`;
      } else if (user.email.endsWith('@thevillageschool.com')) {
        return `${baseUrl}/admin`;
      }
      return baseUrl;
    },
  },
};

// NextAuth handler
const handler = NextAuth(authOptions);

// **Named exports for each HTTP method**
export { handler as GET, handler as POST };