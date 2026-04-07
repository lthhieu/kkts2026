'use server'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleCreateOrUpdateCountries = async (data: any, access_token: string, status: string, dataUpdate?: null | ICountry) => {
    const res = await sendRequest<IBackendResponse<ICountry>>({
        url: status === "CREATE"
            ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/countries`
            : `${process.env.NEXT_PUBLIC_BACKEND_URI}/countries/${dataUpdate?._id}`,
        method: status === "CREATE" ? "POST" : "PATCH",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('countries')
    return res
}

export const handleDeleteCountries = async (_id: string, access_token: string) => {
    const res = await sendRequest<IBackendResponse<ICountry>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/countries/${_id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
    })
    updateTag('countries')
    return res
}

export const handleFilterCountries = async (current: number, pageSize: number, access_token: string) => {
    const res = await sendRequest<IBackendResponse<IModelPaginate<ICountry>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/countries`,
        queryParams: { current, pageSize },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ['countries'] }
        }
    })
    updateTag('countries')
    return res
}

export const handleCreateManyCountries = async (data: any, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/countries/create-many`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data
    })
    updateTag('countries')
    return res
}

export const handleDeleteCountriesMany = async (ids: string[], access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/countries/delete-many`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: ids
    })
    updateTag('countries')
    return res
}
