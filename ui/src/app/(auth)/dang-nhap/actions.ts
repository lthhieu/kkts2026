'use server'
import { signIn, signOut } from "@/auth";
import { sendRequest } from "@/utils/api";

export async function handleSignOut(access_token: string) {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/logout`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    })
    console.log(res.message)
    await signOut()

}

export async function authenticate(email: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: email,
            password: password,
            redirect: false,
        })
        return r
    } catch (error: any) {
        if ((error as any).name === "InvalidEmailPasswordError") {
            return {
                error: "Sai email hoặc mật khẩu",
                code: 1
            }
        } else {
            return {
                error: "Lỗi server, vui lòng thử lại sau",
                code: 0
            }
        }
    }
}