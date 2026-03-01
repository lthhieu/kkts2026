export { }

declare global {
    interface IRequest {
        url: string,
        method?: string,
        body?: { [key: string]: any },
        queryParams?: any,
        useCredentials?: boolean,
        headers?: any,
        nextOption?: any
    }
    interface IBackendResponse<T> {
        error?: string | string[],
        message: string,
        statusCode: number | string,
        data?: T
    }
    interface IMeta {
        current: number,
        pageSize: number,
        pages: number,
        total: number
    }
    interface IModelPaginate<T> {
        meta: IMeta,
        result: T[]
    }
    interface IUser {
        _id: string,
        name: string,
        email: string,
        role: string,
        password?: string,
        "unit"?: {
            "_id": string,
            "name": string
        },
        createdAt: string,
        updatedAt: string
    }
    interface IUnit {
        _id: string,
        name: string,
        createdAt: string,
        updatedAt: string
    }
    interface ILogin {
        access_token: string,
        user: IUser
    }
    interface IDevice {
        "_id": string,
        "name": string,
        "description": string,
        "usedLocation":
        {
            "year": number,
            "room": {
                "_id": string,
                "name": string
            }
        }[],
        "currentRoom": {
            "_id": string,
            "name": string
        },
        "usedYear": number | null,
        "soKeToan": {
            "soLuong": number | null,
            "nguyenGia": number,
            "giaTriConLai": null | number
        },
        "kiemKe": {
            "soLuong": number | null,
            "nguyenGia": number,
            "giaTriConLai": null | number
        },
        "chenhLech": {
            "thua": number,
            "thieu": number,
            "giaTriConLai": null | number
        },
        "chatLuongConLai": number | null,
        "note": string,
        "trongSoChatLuong": number,
        "type": string,
        "unit": {
            "_id": string,
            "name": string
        },
        "createdAt"?: string,
        "updatedAt"?: string,
        "parent"?: string | null,
        children?: IDevice[];
    }
    interface IRoom {
        "_id": string,
        "name": string,
        "info":
        {
            "description": string,
            "year": number,
            "unit": {
                "_id": string,
                "name": string
            }
        }[],
        "currentDescription": string,
        "currentYear": number,
        "currentUnit": {
            "_id": string,
            "name": string
        },
        "createdAt": string,
        "updatedAt": string
    }
}