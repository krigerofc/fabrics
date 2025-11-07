import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers:[
    CredentialsProvider({
        name:'Credentials',
        credentials: {
            email: { label:"Email", type:"email", placeholder:"Your email"},
            password: {label: "Password", type:"Password"}
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null;
            
            const res = await fetch('http://localhost:3000/api/backend/user/login', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await res.json();

            if(res.ok){
              if(data.success == false) return null
              return data.user;
            }
            return null;
        }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Primeira vez que o token é criado (sign in)
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email || '';
        session.user.name = token.name || '';
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };