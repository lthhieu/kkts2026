'use server'
import { sendRequest, sendRequestBlob } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateDatdai = async (data: any, access_token: string, status: string, dataUpdate?: null | IDatdai) => {
    const res = await sendRequest<IBackendResponse<IDatdai>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/datdai`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/datdai/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('datdai')
    return res
}

export const handleDeleteDatdai = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IDatdai>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/datdai/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('datdai')
    return res
}

export const handleCreateManyDatdai = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/datdai/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('datdai')
    return res
}

export const handleDeleteDatdaiMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/datdai/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('datdai')
    return res
}

export const handleExportDatdai = async (
    access_token: string,
) => {
    return await sendRequestBlob({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/datdai/export`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};
