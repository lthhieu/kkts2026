'use server'
import { sendRequest, sendRequestBlob } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateThietbiV2 = async (data: any, access_token: string, status: string, dataUpdate?: null | IDeviceV2) => {
    const { name, description, usedLocation, usedYear, soKeToan, kiemKe, chenhLech, chatLuongConLai, note, trongSoChatLuong, type, unit, statusDevice, childrenIds } = data
    const body: any = { name, description: description === "" ? '—' : description, usedLocation, usedYear, soKeToan, kiemKe, chenhLech, chatLuongConLai, note: note === "" ? '—' : note, trongSoChatLuong, type, unit, childrenIds, status: statusDevice }

    const res = await sendRequest<IBackendResponse<any>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices-v2`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices-v2/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body
    })
    updateTag('devices-v2')
    return res
}

export const handleDeleteThietbiV2 = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices-v2/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('devices-v2')
    return res
}

export const handleCreateManyThietbiV2 = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices-v2/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('devices-v2')
    return res
}

export const handleDeleteThietbiV2Many = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices-v2/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('devices-v2')
    return res
}

export const handleUpdateManyDeviceV2 = async (year: number, access_token: string) => {
    const data = { year }
    const res = await sendRequest<IBackendResponse<IUpdateMany>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices-v2/update-many`,
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: data
    })
    updateTag('devices-v2')
    return res
}

export const handleExportThietbiV2 = async (
    access_token: string,
    type: string, unit: string
) => {
    return await sendRequestBlob({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/devices-v2/export`,
        method: 'GET',
        queryParams: { type, unit },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};
