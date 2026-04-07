'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdatePhgdht = async (data: any, access_token: string, status: string, dataUpdate?: null | IPhgdht) => {
    const res = await sendRequest<IBackendResponse<IPhgdht>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/phgdht`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/phgdht/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('phgdht')
    return res
}

export const handleDeletePhgdht = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IPhgdht>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phgdht/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('phgdht')
    return res
}

export const handleFilterPhgdht = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IPhgdht>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phgdht`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['phgdht'] }
        }
    })
    updateTag('phgdht')
    return res
}

export const handleCreateManyPhgdht = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phgdht/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('phgdht')
    return res
}

export const handleDeletePhgdhtMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phgdht/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('phgdht')
    return res
}
