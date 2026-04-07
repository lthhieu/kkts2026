'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateTinhtrangsudung = async (data: any, access_token: string, status: string, dataUpdate?: null | ITinhtrangsudung) => {
    const res = await sendRequest<IBackendResponse<ITinhtrangsudung>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangsudung`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangsudung/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('tinhtrangsudung')
    return res
}

export const handleDeleteTinhtrangsudung = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ITinhtrangsudung>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangsudung/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('tinhtrangsudung')
    return res
}

export const handleFilterTinhtrangsudung = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ITinhtrangsudung>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangsudung`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['tinhtrangsudung'] }
        }
    })
    updateTag('tinhtrangsudung')
    return res
}

export const handleCreateManyTinhtrangsudung = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangsudung/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('tinhtrangsudung')
    return res
}

export const handleDeleteTinhtrangsudungMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/tinhtrangsudung/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('tinhtrangsudung')
    return res
}
