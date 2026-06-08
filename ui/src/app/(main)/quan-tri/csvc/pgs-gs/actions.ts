'use server'
import { sendRequest, sendRequestBlob } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdatePgsgs = async (data: any, access_token: string, status: string, dataUpdate?: null | ICsvcSubject) => {
    const res = await sendRequest<IBackendResponse<ICsvcSubject>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/pgsgs`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/pgsgs/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('pgsgs')
    return res
}

export const handleDeletePgsgs = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ICsvcSubject>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/pgsgs/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('pgsgs')
    return res
}

export const handleCreateManyPgsgs = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/pgsgs/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('pgsgs')
    return res
}

export const handleDeletePgsgsMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/pgsgs/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('pgsgs')
    return res
}
export const handleExportPgsgs = async (
    access_token: string,
) => {
    return await sendRequestBlob({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/pgsgs/export`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};