'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateNews = async (data: any, access_token: string, status: string, dataUpdate?: null | any) => {
    const { title, thumbnail, slug, content, category } = data
    const body: any = { title, thumbnail, slug, content, category }

    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: status === "CREATE" ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/news` : `${process.env.NEXT_PUBLIC_BACKEND_URI}/news/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body
    })
    updateTag('news')
    return res
}

export const handleDeleteNews = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/news/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('news')
    return res
}

export const handleDeleteNewsMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/news/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('news')
    return res
}