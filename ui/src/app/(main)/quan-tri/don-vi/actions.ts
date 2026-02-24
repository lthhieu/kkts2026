'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateUnit = async (data: any, access_token: string, status: string, dataUpdate?: null | IUnit) => {
    const { name } = data
    const body: any = { name }

    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: status === "CREATE" ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/units` : `${process.env.NEXT_PUBLIC_BACKEND_URI}/units/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body
    })
    updateTag('units')
    return res
}

export const handleDeleteUnit = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/units/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('units')
    return res
}

export const handleCreateMany = async (data: any, access_token: string) => {

    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/units/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('units')
    return res
}

export const handleDeleteUnitMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/units/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('units')
    return res
}