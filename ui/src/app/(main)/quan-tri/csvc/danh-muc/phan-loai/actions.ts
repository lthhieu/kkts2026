'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdatePhanloai = async (data: any, access_token: string, status: string, dataUpdate?: null | IPhanloai) => {
    const res = await sendRequest<IBackendResponse<IPhanloai>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/phanloai`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/phanloai/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('phanloai')
    return res
}

export const handleDeletePhanloai = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IPhanloai>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phanloai/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('phanloai')
    return res
}

export const handleFilterPhanloai = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IPhanloai>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phanloai`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['phanloai'] }
        }
    })
    updateTag('phanloai')
    return res
}

export const handleCreateManyPhanloai = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phanloai/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('phanloai')
    return res
}

export const handleDeletePhanloaiMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phanloai/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('phanloai')
    return res
}
