'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateXaphuong = async (data: any, access_token: string, status: string, dataUpdate?: null | IXaphuong) => {
    const res = await sendRequest<IBackendResponse<IXaphuong>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/xaphuong`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/xaphuong/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('xaphuong')
    return res
}

export const handleDeleteXaphuong = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IXaphuong>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/xaphuong/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('xaphuong')
    return res
}

export const handleFilterXaphuong = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IXaphuong>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/xaphuong`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['xaphuong'] }
        }
    })
    updateTag('xaphuong')
    return res
}

export const handleCreateManyXaphuong = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/xaphuong/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('xaphuong')
    return res
}

export const handleDeleteXaphuongMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/xaphuong/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('xaphuong')
    return res
}
