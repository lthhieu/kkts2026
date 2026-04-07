'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateLoaicongtrinhcsvc = async (data: any, access_token: string, status: string, dataUpdate?: null | ILoaicongtrinhcsvc) => {
    const res = await sendRequest<IBackendResponse<ILoaicongtrinhcsvc>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaicongtrinhcsvc`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaicongtrinhcsvc/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaicongtrinhcsvc')
    return res
}

export const handleDeleteLoaicongtrinhcsvc = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ILoaicongtrinhcsvc>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaicongtrinhcsvc/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('loaicongtrinhcsvc')
    return res
}

export const handleFilterLoaicongtrinhcsvc = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ILoaicongtrinhcsvc>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaicongtrinhcsvc`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['loaicongtrinhcsvc'] }
        }
    })
    updateTag('loaicongtrinhcsvc')
    return res
}

export const handleCreateManyLoaicongtrinhcsvc = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaicongtrinhcsvc/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaicongtrinhcsvc')
    return res
}

export const handleDeleteLoaicongtrinhcsvcMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaicongtrinhcsvc/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('loaicongtrinhcsvc')
    return res
}
