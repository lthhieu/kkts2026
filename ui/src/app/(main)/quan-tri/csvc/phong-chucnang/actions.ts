'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdatePhongchucnang = async (data: any, access_token: string, status: string, dataUpdate?: null | IPhongchucnang) => {
    const res = await sendRequest<IBackendResponse<ICsvcSubject>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/phongchucnang`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/phongchucnang/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('phongchucnang')
    return res
}

export const handleDeletePhongchucnang = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IPhongchucnang>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phongchucnang/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('phongchucnang')
    return res
}

export const handleCreateManyPhongchucnang = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phongchucnang/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('phongchucnang')
    return res
}

export const handleDeletePhongchucnangMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/phongchucnang/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('phongchucnang')
    return res
}
