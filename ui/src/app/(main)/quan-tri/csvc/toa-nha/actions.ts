'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateToanha = async (data: any, access_token: string, status: string, dataUpdate?: null | IToanha) => {
    const res = await sendRequest<IBackendResponse<IToanha>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/toanha`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/toanha/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('toanha')
    return res
}

export const handleDeleteToanha = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IToanha>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/toanha/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('toanha')
    return res
}

export const handleFilterToanha = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IToanha>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/toanha`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['toanha'] }
        }
    })
    updateTag('toanha')
    return res
}

export const handleCreateManyToanha = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/toanha/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('toanha')
    return res
}

export const handleDeleteToanhaMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/toanha/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('toanha')
    return res
}
