'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateMaytoantruong = async (data: any, access_token: string, status: string, dataUpdate?: null | IMaytoantruong) => {
    const res = await sendRequest<IBackendResponse<IMaytoantruong>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/maytoantruong`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/maytoantruong/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('maytoantruong')
    return res
}

export const handleDeleteMaytoantruong = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IMaytoantruong>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/maytoantruong/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('maytoantruong')
    return res
}

export const handleFilterMaytoantruong = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IMaytoantruong>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/maytoantruong`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['maytoantruong'] }
        }
    })
    updateTag('maytoantruong')
    return res
}

export const handleCreateManyMaytoantruong = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/maytoantruong/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('maytoantruong')
    return res
}

export const handleDeleteMaytoantruongMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/maytoantruong/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('maytoantruong')
    return res
}
