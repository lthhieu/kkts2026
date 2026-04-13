'use client'

import { Descriptions, Divider } from 'antd'

interface IProps {
    data: IThuvien | null
}

const ThuvienDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                title="Thông tin chung"
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item label="Mã thư viện">{data.ma_thuvien ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tên thư viện">{data.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Diện tích (m²)">{data.dt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="DT phòng đọc (m²)">{data.dt_phongdoc ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Số phòng đọc">{data.so_phong_doc ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="SL máy tính">{data.soluong_maytinh ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="SL chỗ ngồi đọc sách">{data.soluong_cho_ngoi_doc_sach ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Tình trạng CSVC">{data.tinhtrangcsvc?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Hình thức sở hữu">{data.htsh?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Tình trạng sử dụng">{data.tinh_trang_sd?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Ngày chuyển tình trạng">{data.ngay_chuyen_tt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>{data.diachi ?? '—'}</Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            <Descriptions
                title="Sách & Tạp chí (bản in)"
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={2} label="SL sách">{data.soluong_sach ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={1} label="SL tạp chí">{data.soluong_tapchi ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="SL đầu sách">{data.soluong_dau_sach ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={1} label="SL đầu tạp chí">{data.soluong_dau_tap_chi ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="SL đầu sách có bản in">{data.so_dau_sach_co_ban_in ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={1} label="SL đầu sách in có thể mượn">{data.so_dau_sach_in_co_the_muon_truc_tiep ?? '—'}</Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            <Descriptions
                title="Điện tử & Liên kết"
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={2} label="SL sách điện tử">{data.soluong_sach_dien_tu ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={1} label="SL tạp chí điện tử">{data.soluong_tapchi_dien_tu ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="SL đầu sách điện tử">{data.soluong_dau_sach_dien_tu ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={1} label="SL đầu tạp chí điện tử">{data.soluong_dau_tap_chi_dien_tu ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="SL đầu sách ĐT truy cập trực tuyến">{data.so_dau_sach_dien_tu_co_truy_cap_truc_tuyen ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={1} label="SL TV liên kết trong nước">{data.soluong_thu_vien_lien_ket_trong_nuoc ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="SL TV điện tử liên kết nước ngoài">{data.soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default ThuvienDetail
