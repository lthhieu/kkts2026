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
            "name": string,
            "currentRoom":
            {
                "_id": string,
                "name": string
            }[]
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
    interface INews {
        "_id": string,
        "title": string,
        "slug": string,
        "content": string,
        "thumbnail": string,
        "category": string,
        "author": {
            "_id": string,
            "name": string
        },
        "createdAt": string,
        "updatedAt": string,
        "__v": number
    }

    // ── CSVC Danh mục (catalog) — all share { _id, name } ──────────────────
    interface IHinhthucsohuu { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface IHinhthucsudung { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface ILinhvucdaotao { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface ILoaicongtrinhcsvc { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface ILoaidean { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface ILoaiphonghoc { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface ILoaiptn { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface ILuachon { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface IMucdichsudungcsvc { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface IMucdichsudungdat { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface IPhanloai { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface ICountry { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface ITinhthanhpho { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface ITinhtrangcsvc { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface ITinhtrangsudung { _id: string; name: string; createdAt?: string; updatedAt?: string }
    interface IXaphuong {
        _id: string; name: string;
        "tinhthanhpho": {
            "_id": string,
            "name": string
        };
        createdAt?: string; updatedAt?: string
    }

    // ── CSVC Main entities ──────────────────────────────────────────────────
    interface IDatdai {
        _id: string;
        ma_giay_cnqsh: string;
        dt: number;
        htsd: { _id: string; name: string } | null;
        cqsh: string | null;
        minh_chung_qshd: string | null;
        muc_dich_shd: { _id: string; name: string } | null;
        nam_bd_sdd: number;
        tg_sdd: number;
        dtd_da_sd: number;
        tinh_trang_sd: { _id: string; name: string } | null;
        ngay_chuyen_tt: string | null;
        tinhthanhpho: { _id: string; name: string } | null;
        xaphuong: { _id: string; name: string } | null;
        diachi: string | null;
        createdAt?: string;
        updatedAt?: string;
    }

    interface IToanha {
        _id: string;
        ma_toanha: string;
        ten_toanha: string;
        dtxd: number;
        tong_dt_sxd: number;
        so_tang: number;
        nam_sd: number;
        htsh: { _id: string; name: string } | null;
        diachi: string | null;
        tinh_trang_sd: { _id: string; name: string } | null;
        ngay_chuyen_tt: string | null;
        createdAt?: string;
        updatedAt?: string;
    }

    interface IPhgdht {
        _id: string;
        ma_phgdht: string;
        name: string;
        dt: number;
        htsh: { _id: string; name: string } | null;
        qui_mo_cho_ngoi: number;
        tinhtrangcsvc: { _id: string; name: string } | null;
        phanloai: { _id: string; name: string } | null;
        loaiphonghoc: { _id: string; name: string } | null;
        loaidean: { _id: string; name: string } | null;
        nam_sd: number;
        diachi: string | null;
        tinh_trang_sd: { _id: string; name: string } | null;
        ngay_chuyen_tt: string | null;
        createdAt?: string;
        updatedAt?: string;
    }

    interface IKtx {
        _id: string;
        ma_ktx: string;
        htsh: { _id: string; name: string } | null;
        tong_so_cho_o: number;
        tong_dt: number;
        tinhtrangcsvc: { _id: string; name: string } | null;
        tong_so_phong_o_sv: number;
        nam_sd: number;
        diachi: string | null;
        tinh_trang_sd: { _id: string; name: string } | null;
        ngay_chuyen_tt: string | null;
        createdAt?: string;
        updatedAt?: string;
    }

    interface ICtk {
        _id: string;
        ma_ct: string;
        ten_ct: string;
        loaicongtrinhcsvc: { _id: string; name: string } | null;
        mucdichsudungcsvc: { _id: string; name: string } | null;
        doi_tuong_sd: string;
        dt_sxd: number;
        von_bd: number;
        von_dt: number;
        tinhtrangcsvc: { _id: string; name: string } | null;
        htsh: { _id: string; name: string } | null;
        ct_csvc_trongnha: { _id: string; name: string } | null;
        so_phong_o_cong_vu_cho_cb_giangday: number;
        so_cho_o_cho_cb_giangday: number;
        nam_sd: number;
        diachi: string | null;
        tinh_trang_sd: { _id: string; name: string } | null;
        ngay_chuyen_tt: string | null;
        createdAt?: string;
        updatedAt?: string;
    }

    interface IPtn {
        _id: string;
        ma_ct_csvc: { _id: string; ten_ct: string } | null;
        loai_ptn: { _id: string; name: string } | null;
        phuc_vu_nganh: { _id: string; name: string } | null;
        muc_do_dap_ung_nhu_cau_nckh: string;
        nam_sd: number;
        createdAt?: string;
        updatedAt?: string;
    }

    interface IXth {
        _id: string;
        ma_ct_csvc: { _id: string; ten_ct: string } | null;
        phuc_vu_nganh: { _id: string; name: string } | null;
        muc_do_dap_ung_nhu_cau_nckh: string;
        nam_sd: number;
        createdAt?: string;
        updatedAt?: string;
    }

    interface ITbiptn {
        _id: string;
        ma_tb: string;
        ma_ct_csvc: { _id: string; ten_ct: string } | null;
        ten_tb: string;
        nam_sx: number;
        xuatxu: { _id: string; name: string } | null;
        hang_sx: string | null;
        sl_tb_cungloai: number;
        nam_sd: number;
        tinh_trang_sd: { _id: string; name: string } | null;
        ngay_chuyen_tt: string | null;
        createdAt?: string;
        updatedAt?: string;
    }

    interface IThuvien {
        _id: string;
        ma_thuvien: string;
        name: string;
        nam_sd: number;
        dt: number;
        dt_phongdoc: number;
        so_phong_doc: number;
        soluong_maytinh: number;
        soluong_cho_ngoi_doc_sach: number;
        soluong_sach: number;
        soluong_tapchi: number;
        soluong_sach_dien_tu: number;
        soluong_tapchi_dien_tu: number;
        soluong_thu_vien_lien_ket_trong_nuoc: number;
        soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai: number;
        tinhtrangcsvc: { _id: string; name: string } | null;
        htsh: { _id: string; name: string } | null;
        soluong_dau_sach: number;
        soluong_dau_tap_chi: number;
        soluong_dau_sach_dien_tu: number;
        soluong_dau_tap_chi_dien_tu: number;
        diachi: string | null;
        tinh_trang_sd: { _id: string; name: string } | null;
        ngay_chuyen_tt: string | null;
        so_dau_sach_dien_tu_co_truy_cap_truc_tuyen: number;
        so_dau_sach_co_ban_in: number;
        so_dau_sach_in_co_the_muon_truc_tiep: number;
        createdAt?: string;
        updatedAt?: string;
    }
}