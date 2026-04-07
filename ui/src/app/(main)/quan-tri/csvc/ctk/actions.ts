'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateCtk = async (data: any, access_token: string, status: string, dataUpdate?: null | ICtk) => {
    const res = await sendRequest<IBackendResponse<ICtk>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/ctk`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/ctk/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('ctk')
    return res
}

export const handleDeleteCtk = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ICtk>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ctk/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('ctk')
    return res
}

export const handleFilterCtk = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ICtk>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ctk`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['ctk'] }
        }
    })
    updateTag('ctk')
    return res
}

export const handleCreateManyCtk = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ctk/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('ctk')
    return res
}

export const handleDeleteCtkMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ctk/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('ctk')
    return res
}
