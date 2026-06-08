'use server'
import { sendRequest, sendRequestBlob } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateThuchanh = async (data: any, access_token: string, status: string, dataUpdate?: null | ICsvcSubject) => {
    const res = await sendRequest<IBackendResponse<ICsvcSubject>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuchanh`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuchanh/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('thuchanh')
    return res
}

export const handleDeleteThuchanh = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ICsvcSubject>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuchanh/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('thuchanh')
    return res
}

export const handleCreateManyThuchanh = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuchanh/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('thuchanh')
    return res
}

export const handleDeleteThuchanhMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuchanh/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('thuchanh')
    return res
}

export const handleExportThuchanh = async (
    access_token: string,
) => {
    return await sendRequestBlob({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/thuchanh/export`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};
