'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'
export const handleCreateSnapshot = async (year: number, access_token: string) => {
    const data = { year }
    const res = await sendRequest<IBackendResponse<ICreateSnapshot>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/snapshot`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: data
    })
    updateTag('snapshot')
    return res
}

export const handleDeleteSnapshot = async (year: number, access_token: string) => {
    const data = { year }
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/snapshot/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: data
    })
    updateTag('snapshot')
    return res
}