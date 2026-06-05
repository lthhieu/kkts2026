'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateLoaiphong = async (data: any, access_token: string, status: string, dataUpdate?: null | ILoaiphong) => {
    const res = await sendRequest<IBackendResponse<ILoaiphong>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaiphong')
    return res
}

export const handleDeleteLoaiphong = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ILoaiphong>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('loaiphong')
    return res
}

export const handleFilterLoaiphong = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ILoaiphong>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['loaiphong'] }
        }
    })
    updateTag('loaiphong')
    return res
}

export const handleCreateManyLoaiphong = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaiphong')
    return res
}

export const handleDeleteLoaiphongMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('loaiphong')
    return res
}
