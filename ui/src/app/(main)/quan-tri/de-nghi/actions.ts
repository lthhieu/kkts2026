'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateRequest = async (data: IRequestModule, access_token: string) => {
    const { name, description, device, image, type, unit } = data
    const body: any = { name, description, device, image, type, unit }

    const res = await sendRequest<IBackendResponse<IUnit>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/requests`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body
    })
    updateTag('requests')
    return res
}

export const handleDeleteRequest = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IRequestModule>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/requests/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('requests')
    return res
}

export const handleDeleteRequestMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<IRequestModule>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/requests/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('requests')
    return res
}

export const handleAddComment = async (id: string, access_token: string, content: string) => {
    const body: any = { content }
    const res = await sendRequest<IBackendResponse<IRequestModule>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/requests/add-comment/${id}`,
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body
    })
    updateTag('requests')
    return res
}

export const handleUpdateStatus = async (id: string, access_token: string, status: string) => {
    const body: any = { status }
    const res = await sendRequest<IBackendResponse<IRequestModule>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/requests/${id}`,
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body
    })
    updateTag('requests')
    return res
}

export const handleGetRequestById = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IRequestModule>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/requests/${_id}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        }
    });
    return res;
}