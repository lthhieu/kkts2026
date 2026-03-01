'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateDevice = async (data: any, access_token: string, status: string, dataUpdate?: null | IDevice) => {
    const { name, description, usedLocation, usedYear, soKeToan, kiemKe, chenhLech, chatLuongConLai, note, trongSoChatLuong, type, unit, parent } = data
    const body: any = { name, description, usedLocation, usedYear, soKeToan, kiemKe, chenhLech, chatLuongConLai, note, trongSoChatLuong, type, unit, parent }

    const res = await sendRequest<IBackendResponse<any>>({
        url: status === "CREATE" ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices` : `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body
    })
    updateTag('devices')
    return res
}

export const handleDeleteDevice = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('devices')
    return res
}

export const handleFilter = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<IDevice>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['devices'] }
        }
    })
    updateTag('devices')
    return res
}

export const handleCreateMany = async (data: any, access_token: string) => {

    const res = await sendRequest<IBackendResponse<IDevice>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('devices')
    return res
}
// handleDeleteDeviceMany
export const handleDeleteDeviceMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('devices')
    return res
}