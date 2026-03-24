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
        updatedAt: string,
        phone?: string
    }
    interface IUnit {
        _id: string,
        name: string,
        createdAt: string,
        updatedAt: string
    }
    interface ILogin {
        access_token: string,
        refresh_token: string,
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
            }[],
            reason?: string,
            person?: string
        }[],
        "currentRoom": {
            "_id": string,
            "name": string,
            "users":
            {
                "_id": string,
                "name": string,
                "phone"?: string | null
            }[],
        }[],

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
        status?: string,
        children?: IDevice[];
        isDeleted: boolean;
        deletedAt: Date | null;
        deletedBy: string
    }

    interface IRequestModule {
        "_id": string,
        "name": string,
        "type": string,
        "status": string,
        "createdBy": string,
        "device": {
            "_id": string,
            "name": string
        },
        "description": string,
        "image": string,
        "unit": {
            "_id": string,
            "name": string
        },
        "comments": {
            "content": string,
            "createdBy": string,
            "createdAt": string,
            "_id": string
        }[],
        "createdAt": string,
        "updatedAt": string,
        "__v": number,
        "reason": null | string
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
        "updatedAt": string,
        "users":
        {
            "_id": string,
            "name": string
        }[]
    }
    interface IDatabase {
        "users": number | null,
        "units": number | null,
        "rooms": number | null,
        "devices": number | null,
        "requests": number | null
    }
    interface IUpdateMany {
        matched: number,
        updated: number
    }
    interface IUploadImage {
        "filename": string,
        "folder": string,
        "link": string
    }
    interface ICreateSnapshot {
        "message": string,
        "count": number
    }
    interface IGetYearSnapshot {
        "years": {
            value: string, label: string
        }[]
    }
    interface ISnapshot {
        "_id": string,
        "year"?: number,
        "closedBy"?: string,
        "name": string,
        "description": string,
        "room": string,
        "usedYear": number | null,
        "soKeToan": {
            "soLuong": number | null,
            "nguyenGia": number | null,
            "giaTriConLai": number | null
        },
        "kiemKe": {
            "soLuong": number | null,
            "nguyenGia": number | null,
            "giaTriConLai": number | null
        },
        "chenhLech": {
            "thua": number | null,
            "thieu": number | null,
            "giaTriConLai": number | null
        },
        "chatLuongConLai": number | null,
        "note": string,
        "trongSoChatLuong": number | null,
        "type": string,
        "unit": string,
        "parent"?: string | null,
        "status"?: string,
        "isDeleted": boolean,
        "deletedAt": string | null,
        "deletedBy": string | null,
        "__v"?: number,
        "createdAt"?: string,
        "updatedAt"?: string,
        children?: ISnapshot[];
    }
}