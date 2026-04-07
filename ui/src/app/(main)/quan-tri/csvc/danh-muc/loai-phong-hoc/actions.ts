'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateLoaiphonghoc = async (data: any, access_token: string, status: string, dataUpdate?: null | ILoaiphonghoc) => {
    const res = await sendRequest<IBackendResponse<ILoaiphonghoc>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphonghoc`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphonghoc/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaiphonghoc')
    return res
}

export const handleDeleteLoaiphonghoc = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ILoaiphonghoc>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphonghoc/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('loaiphonghoc')
    return res
}

export const handleFilterLoaiphonghoc = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ILoaiphonghoc>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphonghoc`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['loaiphonghoc'] }
        }
    })
    updateTag('loaiphonghoc')
    return res
}

export const handleCreateManyLoaiphonghoc = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphonghoc/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaiphonghoc')
    return res
}

export const handleDeleteLoaiphonghocMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphonghoc/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('loaiphonghoc')
    return res
}
