'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateRoom = async (data: any, access_token: string, status: string, dataUpdate?: null | IUnit) => {
    const { name, info } = data
    const body: any = { name, info }

    const res = await sendRequest<IBackendResponse<any>>({
        url: status === "CREATE" ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/rooms` : `${process.env.NEXT_PUBLIC_BACKEND_URI}/rooms/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body
    })
    updateTag('rooms')
    return res
}

export const handleDeleteRoom = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/rooms/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('rooms')
    return res
}

export const handleCreateMany = async (data: any, access_token: string) => {

    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/rooms/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('rooms')
    return res
}

export const handleDeleteRoomMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/rooms/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('rooms')
    return res
}