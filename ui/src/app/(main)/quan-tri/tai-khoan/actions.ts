'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateUser = async (data: any, access_token: string, status: string, dataUpdate?: null | IUser) => {
    const { name, email, password, unit, role } = data
    const body: any = { email, name, password, unit, role }
    if (!password)
        delete body.password

    const res = await sendRequest<IBackendResponse<IUser>>({
        url: status === "CREATE" ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/users` : `${process.env.NEXT_PUBLIC_BACKEND_URI}/users/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body
    })
    updateTag('users')
    return res
}

export const handleDeleteUser = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IUser>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/users/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('users')
    return res
}