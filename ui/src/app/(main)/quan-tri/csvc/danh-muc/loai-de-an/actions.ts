'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateLoaidean = async (data: any, access_token: string, status: string, dataUpdate?: null | ILoaidean) => {
    const res = await sendRequest<IBackendResponse<ILoaidean>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaidean`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaidean/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaidean')
    return res
}

export const handleDeleteLoaidean = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ILoaidean>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaidean/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('loaidean')
    return res
}

export const handleFilterLoaidean = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ILoaidean>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaidean`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['loaidean'] }
        }
    })
    updateTag('loaidean')
    return res
}

export const handleCreateManyLoaidean = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaidean/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaidean')
    return res
}

export const handleDeleteLoaideanMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaidean/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('loaidean')
    return res
}
