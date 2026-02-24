import NextAuth, { type DefaultSession } from "next-auth"
declare module "next-auth" {
    interface Session {
        user: IUser & DefaultSession["user"],
        access_token: string,
        // refresh_token: string,
        // access_expire: number,
        // error: string,
    }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        user: IUser,
        access_token: string,
        // refresh_token: string,
        // access_expire: number,
        // error: string
    }
}