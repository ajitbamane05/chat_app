import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db";
import bcrypt from "bcrypt";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials, req, res) => {
        var user = await db.User.findUnique({
          where: {
            username: credentials.username,
          },
        });
        if (user) {
          let compare = await bcrypt.compareSync(
            credentials.password,
            user.password
          );
          if (compare) {
            return await {
              name: user.username,
              id: user.user_id || "subscriberId",
              isAdmin: user.isAdmin
            };
          }
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.isAdmin=user.isAdmin
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.isAdmin=token.isAdmin;
      }
      return session;
    },
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET,
    encryption: true,
  },
  pages: {
    signIn: "/",
  },
  session: {
    maxAge: 60 * 60 * 24,
  },
};

export default NextAuth(authOptions);
