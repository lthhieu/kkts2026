import { InvalidEmailPasswordError } from "@/app/(auth)/dang-nhap/errors"
import { sendRequest } from "@/utils/api"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                const res = await sendRequest<IBackendResponse<ILogin>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/login`,
                    method: 'POST',
                    body: {
                        username: credentials?.username,
                        password: credentials?.password
                    },
                })
                if (res.statusCode === 401) {
                    throw new InvalidEmailPasswordError()
                }
                if (!res.data) {
                    throw new Error(res.message || 'Failed to authenticate')
                }

                // return user object with their profile data
                return res.data as any
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    pages: {
        signIn: '/dang-nhap'
    },
    callbacks: {
        async jwt({ token, user, account, trigger }) {
            if (trigger === 'signIn' && account?.provider !== 'credentials') {
                const res = await sendRequest<IBackendResponse<ILogin>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/google`,
                    method: 'POST',
                    body: {
                        name: user?.name,
                        email: user?.email
                    },
                })
                if (res.data) {
                    token.user = res.data.user
                    token.access_token = res.data.access_token
                }
            }
            if (user && trigger === 'signIn' && account?.provider === 'credentials') { // User is available during sign-in
                token.user = (user as ILogin).user
                token.access_token = (user as ILogin).access_token
            }
            return token
        },
        session({ session, token }) {
            session.user = token.user as any
            session.access_token = token.access_token
            return session
        },
        authorized: async ({ auth }) => {
            return !!auth
        },
    },
})