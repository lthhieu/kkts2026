'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateXth = async (data: any, access_token: string, status: string, dataUpdate?: null | IXth) => {
    const res = await sendRequest<IBackendResponse<IXth>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/xth`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/xth/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('xth')
    return res
}

export const handleDeleteXth = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IXth>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/xth/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('xth')
    return res
}

export const handleFilterXth = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IXth>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/xth`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['xth'] }
        }
    })
    updateTag('xth')
    return res
}

export const handleCreateManyXth = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/xth/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('xth')
    return res
}

export const handleDeleteXthMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/xth/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('xth')
    return res
}
