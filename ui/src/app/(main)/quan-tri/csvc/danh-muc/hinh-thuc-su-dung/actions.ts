'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateHinhthucsudung = async (data: any, access_token: string, status: string, dataUpdate?: null | IHinhthucsudung) => {
    const res = await sendRequest<IBackendResponse<IHinhthucsudung>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsudung`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsudung/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('hinhthucsudung')
    return res
}

export const handleDeleteHinhthucsudung = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IHinhthucsudung>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsudung/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('hinhthucsudung')
    return res
}

export const handleFilterHinhthucsudung = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IHinhthucsudung>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsudung`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['hinhthucsudung'] }
        }
    })
    updateTag('hinhthucsudung')
    return res
}

export const handleCreateManyHinhthucsudung = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsudung/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('hinhthucsudung')
    return res
}

export const handleDeleteHinhthucsudungMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsudung/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('hinhthucsudung')
    return res
}
