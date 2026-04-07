'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateTbiptn = async (data: any, access_token: string, status: string, dataUpdate?: null | ITbiptn) => {
    const res = await sendRequest<IBackendResponse<ITbiptn>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbiptn`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbiptn/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('tbiptn')
    return res
}

export const handleDeleteTbiptn = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ITbiptn>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbiptn/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('tbiptn')
    return res
}

export const handleFilterTbiptn = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ITbiptn>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbiptn`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['tbiptn'] }
        }
    })
    updateTag('tbiptn')
    return res
}

export const handleCreateManyTbiptn = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbiptn/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('tbiptn')
    return res
}

export const handleDeleteTbiptnMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbiptn/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('tbiptn')
    return res
}
