'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateMucdichsudungcsvc = async (data: any, access_token: string, status: string, dataUpdate?: null | IMucdichsudungcsvc) => {
    const res = await sendRequest<IBackendResponse<IMucdichsudungcsvc>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungcsvc`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungcsvc/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('mucdichsudungcsvc')
    return res
}

export const handleDeleteMucdichsudungcsvc = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IMucdichsudungcsvc>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungcsvc/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('mucdichsudungcsvc')
    return res
}

export const handleFilterMucdichsudungcsvc = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IMucdichsudungcsvc>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungcsvc`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['mucdichsudungcsvc'] }
        }
    })
    updateTag('mucdichsudungcsvc')
    return res
}

export const handleCreateManyMucdichsudungcsvc = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungcsvc/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('mucdichsudungcsvc')
    return res
}

export const handleDeleteMucdichsudungcsvcMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/mucdichsudungcsvc/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('mucdichsudungcsvc')
    return res
}
