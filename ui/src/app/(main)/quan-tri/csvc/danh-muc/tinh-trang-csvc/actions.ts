'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateTinhtrangcsvc = async (data: any, access_token: string, status: string, dataUpdate?: null | ITinhtrangcsvc) => {
    const res = await sendRequest<IBackendResponse<ITinhtrangcsvc>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangcsvc`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangcsvc/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('tinhtrangcsvc')
    return res
}

export const handleDeleteTinhtrangcsvc = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ITinhtrangcsvc>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangcsvc/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('tinhtrangcsvc')
    return res
}

export const handleFilterTinhtrangcsvc = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ITinhtrangcsvc>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangcsvc`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['tinhtrangcsvc'] }
        }
    })
    updateTag('tinhtrangcsvc')
    return res
}

export const handleCreateManyTinhtrangcsvc = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangcsvc/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('tinhtrangcsvc')
    return res
}

export const handleDeleteTinhtrangcsvcMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangcsvc/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('tinhtrangcsvc')
    return res
}
