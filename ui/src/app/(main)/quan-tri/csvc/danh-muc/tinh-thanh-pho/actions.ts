'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateTinhthanhpho = async (data: any, access_token: string, status: string, dataUpdate?: null | ITinhthanhpho) => {
    const res = await sendRequest<IBackendResponse<ITinhthanhpho>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhthanhpho`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhthanhpho/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('tinhthanhpho')
    return res
}

export const handleDeleteTinhthanhpho = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ITinhthanhpho>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhthanhpho/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('tinhthanhpho')
    return res
}

export const handleFilterTinhthanhpho = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ITinhthanhpho>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhthanhpho`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['tinhthanhpho'] }
        }
    })
    updateTag('tinhthanhpho')
    return res
}

export const handleCreateManyTinhthanhpho = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhthanhpho/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('tinhthanhpho')
    return res
}

export const handleDeleteTinhthanhphoMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhthanhpho/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('tinhthanhpho')
    return res
}
