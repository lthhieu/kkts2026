'use server'
import { sendRequest, sendRequestBlob } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateChungtu = async (data: any, access_token: string, status: string, dataUpdate?: null | IChungtu) => {
    const { noidung, ngaynhan, ngayhoanthanh, sotien, trangthai, ghichu, tienbangchu } = data
    const body: any = { noidung, ngaynhan, ngayhoanthanh, sotien, trangthai, ghichu, tienbangchu }

    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: status === "CREATE" ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/chungtu` : `${process.env.NEXT_PUBLIC_BACKEND_URI}/chungtu/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body
    })
    updateTag('chungtu')
    return res
}

export const handleDeleteChungtu = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IChungtu>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/chungtu/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('chungtu')
    return res
}

export const handleCreateMany = async (data: any, access_token: string) => {

    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/chungtu/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('chungtu')
    return res
}

export const handleDeleteChungtuMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/chungtu/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('chungtu')
    return res
}

export const handleExportChungtu = async (access_token: string, month?: number, year?: number) => {
    return await sendRequestBlob({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/chungtu/export`,
        method: 'GET',
        queryParams: { month, year },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};