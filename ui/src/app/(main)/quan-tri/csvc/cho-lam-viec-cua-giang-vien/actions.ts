'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateCholamvieccuagv = async (data: any, access_token: string, status: string, dataUpdate?: null | ICsvcSubject) => {
    const res = await sendRequest<IBackendResponse<ICsvcSubject>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/cholamvieccuagv`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/cholamvieccuagv/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('cholamvieccuagv')
    return res
}

export const handleDeleteCholamvieccuagv = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ICsvcSubject>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/cholamvieccuagv/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('cholamvieccuagv')
    return res
}

export const handleFilterCholamvieccuagv = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ICsvcSubject>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/cholamvieccuagv`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['cholamvieccuagv'] }
        }
    })
    updateTag('cholamvieccuagv')
    return res
}

export const handleCreateManyCholamvieccuagv = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/cholamvieccuagv/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('cholamvieccuagv')
    return res
}

export const handleDeleteCholamvieccuagvMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/cholamvieccuagv/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('cholamvieccuagv')
    return res
}
