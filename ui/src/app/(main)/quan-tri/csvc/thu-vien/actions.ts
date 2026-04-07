'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateThuvien = async (data: any, access_token: string, status: string, dataUpdate?: null | IThuvien) => {
    const res = await sendRequest<IBackendResponse<IThuvien>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuvien`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuvien/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('thuvien')
    return res
}

export const handleDeleteThuvien = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IThuvien>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuvien/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('thuvien')
    return res
}

export const handleFilterThuvien = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IThuvien>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuvien`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['thuvien'] }
        }
    })
    updateTag('thuvien')
    return res
}

export const handleCreateManyThuvien = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuvien/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('thuvien')
    return res
}

export const handleDeleteThuvienMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuvien/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('thuvien')
    return res
}
