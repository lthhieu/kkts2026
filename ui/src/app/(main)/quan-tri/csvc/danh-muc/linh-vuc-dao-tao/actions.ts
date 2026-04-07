'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateLinhvucdaotao = async (data: any, access_token: string, status: string, dataUpdate?: null | ILinhvucdaotao) => {
    const res = await sendRequest<IBackendResponse<ILinhvucdaotao>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/linhvucdaotao`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/linhvucdaotao/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('linhvucdaotao')
    return res
}

export const handleDeleteLinhvucdaotao = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ILinhvucdaotao>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/linhvucdaotao/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('linhvucdaotao')
    return res
}

export const handleFilterLinhvucdaotao = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ILinhvucdaotao>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/linhvucdaotao`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['linhvucdaotao'] }
        }
    })
    updateTag('linhvucdaotao')
    return res
}

export const handleCreateManyLinhvucdaotao = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/linhvucdaotao/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('linhvucdaotao')
    return res
}

export const handleDeleteLinhvucdaotaoMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/linhvucdaotao/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('linhvucdaotao')
    return res
}
