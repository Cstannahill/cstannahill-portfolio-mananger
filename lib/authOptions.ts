import { type NextAuthOptions, type User as NextAuthUser } from "next-auth"; // Renamed User to NextAuthUser
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import connectToDatabase from "@/lib/db/mongodb";
import UserModel, { type IUser } from "@/models/User"; // Renamed User to UserModel

// Define authentication options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        // Added explicit return type
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        await connectToDatabase();
        const userFromDb = (await UserModel.findOne({
          email: credentials.email,
        })
          .select("+password")
          .lean()) as unknown as
          | (IUser & { _id: import("mongoose").Types.ObjectId })
          | null;

        if (!userFromDb) {
          throw new Error("No user found with this email");
        }

        if (!userFromDb.password) {
          throw new Error(
            "Password not retrieved from database. Ensure it is selected."
          );
        }

        const isValid = await compare(
          credentials.password,
          userFromDb.password
        );
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // Return a user object that NextAuth can use
        // Ensure it matches the expected structure for your session/JWT
        return {
          id: userFromDb._id.toString(),
          email: userFromDb.email,
          name: userFromDb.name,
          role: userFromDb.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // It's important to ensure that the user object passed here also has the role
        // If user comes from authorize, it should have it.
        // If user comes from another provider or a different flow, ensure role is added.
        if (user.role) {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    // error: '/auth/error', // Custom error page
    // signOut: '/auth/logout',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
