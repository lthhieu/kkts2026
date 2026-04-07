'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateLuachon = async (data: any, access_token: string, status: string, dataUpdate?: null | ILuachon) => {
    const res = await sendRequest<IBackendResponse<ILuachon>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/luachon`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/luachon/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('luachon')
    return res
}

export const handleDeleteLuachon = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ILuachon>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/luachon/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('luachon')
    return res
}

export const handleFilterLuachon = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ILuachon>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/luachon`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['luachon'] }
        }
    })
    updateTag('luachon')
    return res
}

export const handleCreateManyLuachon = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/luachon/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('luachon')
    return res
}

export const handleDeleteLuachonMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/luachon/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('luachon')
    return res
}
