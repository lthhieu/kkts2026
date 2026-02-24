import { InvalidEmailPasswordError } from "@/app/(auth)/dang-nhap/errors"
import { sendRequest } from "@/utils/api"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

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
    ],
    pages: {
        signIn: '/dang-nhap'
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
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