'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateLoaiptn = async (data: any, access_token: string, status: string, dataUpdate?: null | ILoaiptn) => {
    const res = await sendRequest<IBackendResponse<ILoaiptn>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiptn`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiptn/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaiptn')
    return res
}

export const handleDeleteLoaiptn = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ILoaiptn>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiptn/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('loaiptn')
    return res
}

export const handleFilterLoaiptn = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ILoaiptn>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiptn`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['loaiptn'] }
        }
    })
    updateTag('loaiptn')
    return res
}

export const handleCreateManyLoaiptn = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiptn/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaiptn')
    return res
}

export const handleDeleteLoaiptnMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiptn/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('loaiptn')
    return res
}
