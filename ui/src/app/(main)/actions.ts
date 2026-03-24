'use server'
import { IChangePasswordDto } from '@/components/dashboard/change-password-modal'
import { IUpdateInfoDto } from '@/components/dashboard/update.info'
import { sendRequest } from '@/utils/api'
import { updateTag } from 'next/cache'

export const handleChangePassword = async (data: IChangePasswordDto, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/users/change-password`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: data
    })
    updateTag('users')
    return res
}

export const handleUpdateInfo = async (data: IUpdateInfoDto, access_token: string) => {
    const res = await sendRequest<IBackendResponse<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/users/update-info`,
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${access_token!}`,
        },
        body: data
    })
    updateTag('users')
    return res
}