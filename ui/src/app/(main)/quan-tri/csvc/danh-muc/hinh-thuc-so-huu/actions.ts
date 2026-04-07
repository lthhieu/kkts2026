'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateHinhthucsohuu = async (data: any, access_token: string, status: string, dataUpdate?: null | IHinhthucsohuu) => {
    const res = await sendRequest<IBackendResponse<IHinhthucsohuu>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsohuu`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsohuu/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('hinhthucsohuu')
    return res
}

export const handleDeleteHinhthucsohuu = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IHinhthucsohuu>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsohuu/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('hinhthucsohuu')
    return res
}

export const handleFilterHinhthucsohuu = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IHinhthucsohuu>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsohuu`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['hinhthucsohuu'] }
        }
    })
    updateTag('hinhthucsohuu')
    return res
}

export const handleCreateManyHinhthucsohuu = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsohuu/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('hinhthucsohuu')
    return res
}

export const handleDeleteHinhthucsohuuMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/hinhthucsohuu/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('hinhthucsohuu')
    return res
}
