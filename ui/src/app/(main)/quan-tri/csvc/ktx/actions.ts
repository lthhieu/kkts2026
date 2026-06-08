'use server'
import { sendRequest, sendRequestBlob } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateKtx = async (data: any, access_token: string, status: string, dataUpdate?: null | IKtx) => {
    const res = await sendRequest<IBackendResponse<IKtx>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/ktx`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/ktx/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('ktx')
    return res
}

export const handleDeleteKtx = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IKtx>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ktx/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('ktx')
    return res
}

export const handleCreateManyKtx = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ktx/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('ktx')
    return res
}

export const handleDeleteKtxMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ktx/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('ktx')
    return res
}

export const handleExportKtx = async (
    access_token: string,
) => {
    return await sendRequestBlob({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ktx/export`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};
