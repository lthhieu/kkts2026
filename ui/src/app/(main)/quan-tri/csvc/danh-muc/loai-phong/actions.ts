'use server'
import { sendRequest, sendRequestBlob } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateLoaiphong = async (data: any, access_token: string, status: string, dataUpdate?: null | ILoaiphong) => {
    const res = await sendRequest<IBackendResponse<ILoaiphong>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaiphong')
    return res
}

export const handleDeleteLoaiphong = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ILoaiphong>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('loaiphong')
    return res
}
export const handleCreateManyLoaiphong = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('loaiphong')
    return res
}

export const handleDeleteLoaiphongMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('loaiphong')
    return res
}
export const handleExportLoaiphong = async (
    access_token: string,
) => {
    return await sendRequestBlob({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/loaiphong/export`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};
