import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

console.log({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
      } catch (error) {
        console.error("Error fetching session user:", error);
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // Check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // Otherwise create one
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(), // Fixed typo here
            image: profile.picture,
          });
          console.log("New user created:", profile.email);
        } else {
          console.log("User already exists:", profile.email);
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
