'use server'
import { sendRequestFile } from "@/utils/api"

export const handleUploadImage = async (file: any, access_token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await sendRequestFile<IBackendResponse<IUploadImage>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/upload/single-image`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token!}`,
            'folder_type': 'de-nghi'
        },
        body: formData
    })
    return res
}