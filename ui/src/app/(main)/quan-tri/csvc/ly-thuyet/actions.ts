'use server'
import { sendRequest, sendRequestBlob } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateLythuyet = async (data: any, access_token: string, status: string, dataUpdate?: null | ICsvcSubject) => {
    const res = await sendRequest<IBackendResponse<ICsvcSubject>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/lythuyet`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/lythuyet/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('lythuyet')
    return res
}

export const handleDeleteLythuyet = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ICsvcSubject>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/lythuyet/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('lythuyet')
    return res
}

export const handleCreateManyLythuyet = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/lythuyet/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('lythuyet')
    return res
}

export const handleDeleteLythuyetMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/lythuyet/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('lythuyet')
    return res
}

export const handleExportLythuyet = async (
    access_token: string,
) => {
    return await sendRequestBlob({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/lythuyet/export`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};