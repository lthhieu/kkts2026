'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdatePtn = async (data: any, access_token: string, status: string, dataUpdate?: null | IPtn) => {
    const res = await sendRequest<IBackendResponse<IPtn>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/ptn`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/ptn/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('ptn')
    return res
}

export const handleDeletePtn = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IPtn>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ptn/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('ptn')
    return res
}

export const handleFilterPtn = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IPtn>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ptn`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['ptn'] }
        }
    })
    updateTag('ptn')
    return res
}

export const handleCreateManyPtn = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ptn/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('ptn')
    return res
}

export const handleDeletePtnMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ptn/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('ptn')
    return res
}
