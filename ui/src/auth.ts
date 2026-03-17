import { InvalidEmailPasswordError } from "@/app/(auth)/dang-nhap/errors"
import { sendRequest } from "@/utils/api"
import dayjs from "dayjs"
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

async function refreshAccessToken(token: JWT) {
    const res = await sendRequest<IBackendResponse<JWT>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/refresh-token`,
        method: 'POST',
        body: { refresh_token: token?.refresh_token, userid: token.user._id }
    })
    if (res.data) {
        console.log('new refresh token', res.data.refresh_token.slice(-5))
        return {
            ...token,
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token,
            access_expire: dayjs(new Date()).add(+(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)).unix(),
            error: ""
        }
    } else {
        // console.log(res.message)
        //failed to refresh token => do nothing
        return {
            ...token,
            error: "RefreshAccessTokenError", // This is used in the front-end, and if present, we can force a re-login, or similar
        }
    }
}

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
                    token.refresh_token = res.data.refresh_token
                    token.access_expire = dayjs(new Date()).add(+(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)).unix()
                }
            }
            if (user && trigger === 'signIn' && account?.provider === 'credentials') { // User is available during sign-in
                token.user = (user as ILogin).user
                token.access_token = (user as ILogin).access_token
                token.refresh_token = (user as ILogin).refresh_token
                token.access_expire = dayjs(new Date()).add(+(process.env.TOKEN_EXPIRE_NUMBER as string), (process.env.TOKEN_EXPIRE_UNIT as any)).unix()

            }
            const isTimeAfter = dayjs(new Date()).isAfter(dayjs.unix(token.access_expire as number ?? 0))

            if (isTimeAfter) {
                //refresh token
                return await refreshAccessToken(token)
            }
            return token
        },
        session({ session, token }) {
            session.user = token.user as any
            session.access_token = token.access_token
            session.refresh_token = token.refresh_token
            session.error = token.error
            return session
        },
        authorized: async ({ auth }) => {
            return !!auth
        },
    },
})