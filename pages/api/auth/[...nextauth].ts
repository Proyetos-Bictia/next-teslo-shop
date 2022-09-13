import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {label: 'Correo', type: 'email', placeholder: 'camilo@gmail.com'},
        password: {label: 'Contraseña', type: 'password', placeholder: '*****'},
      },
      async authorize(credentials) {
        // return { name: 'Juan', correo: 'juan@google.com', role: 'admin' };
        console.log(credentials);
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password)
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

  ],

  //Custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000, // cada 30 dias
    strategy: 'jwt',
    updateAge: 86400 // cada dia
  },

  //Callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      // console.log({token, account, user});
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {

          case 'oauth':
            // TODO crear usuario o verificar si existe en mi DB
            token.user = await dbUsers.oAuthTODbUser(user?.email || '', user?.name || '');
            break;

          case 'credentials':
            token.user = user
            break;
        
          default:
            break;
        }
      }
      
      return token;
    },

    async session({ session, token, user }) {

      session.accessToken = token.accessToken;
      session.user = token.user as any;
      
      return session
    }
  }
});

