'use server'
import { sendRequest, sendRequestBlob } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateNcc = async (data: any, access_token: string, status: string, dataUpdate?: null | IUnit) => {
    const { name } = data
    const body: any = { name }

    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: status === "CREATE" ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/ncc` : `${process.env.NEXT_PUBLIC_BACKEND_URI}/ncc/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body
    })
    updateTag('ncc')
    return res
}

export const handleDeleteNcc = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ncc/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('ncc')
    return res
}

export const handleCreateMany = async (data: any, access_token: string) => {

    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ncc/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('ncc')
    return res
}

export const handleDeleteNccMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ncc/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('ncc')
    return res
}

export const handleExportNcc = async (
    access_token: string,
) => {
    return await sendRequestBlob({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/ncc/export`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};