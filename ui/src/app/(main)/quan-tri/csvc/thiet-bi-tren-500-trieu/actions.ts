'use server'
import { sendRequest, sendRequestBlob } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateTBTren500tr = async (data: any, access_token: string, status: string, dataUpdate?: null | ITBTren500tr) => {
    const res = await sendRequest<IBackendResponse<ITBTren500tr>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbtren500tr`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbtren500tr/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('tbtren500tr')
    return res
}

export const handleDeleteTBTren500tr = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ITBTren500tr>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbtren500tr/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('tbtren500tr')
    return res
}

export const handleCreateManyTBTren500tr = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbtren500tr/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('tbtren500tr')
    return res
}

export const handleDeleteTBTren500trMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbtren500tr/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('tbtren500tr')
    return res
}

export const handleExportTBTren500tr = async (
    access_token: string,
) => {
    return await sendRequestBlob({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tbtren500tr/export`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};
