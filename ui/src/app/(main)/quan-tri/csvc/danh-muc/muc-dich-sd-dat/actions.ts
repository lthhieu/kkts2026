'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateMucdichsudungdat = async (data: any, access_token: string, status: string, dataUpdate?: null | IMucdichsudungdat) => {
    const res = await sendRequest<IBackendResponse<IMucdichsudungdat>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungdat`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungdat/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('mucdichsudungdat')
    return res
}

export const handleDeleteMucdichsudungdat = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IMucdichsudungdat>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungdat/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('mucdichsudungdat')
    return res
}

export const handleFilterMucdichsudungdat = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IMucdichsudungdat>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungdat`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['mucdichsudungdat'] }
        }
    })
    updateTag('mucdichsudungdat')
    return res
}

export const handleCreateManyMucdichsudungdat = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungdat/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('mucdichsudungdat')
    return res
}

export const handleDeleteMucdichsudungdatMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungdat/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('mucdichsudungdat')
    return res
}
