'use client'

import { Descriptions, Divider } from 'antd'

interface IProps {
    data: ICtk | null
}

const CtkDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                title="Định danh"
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item label="Mã công trình">{data.ma_ct ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tên công trình">{data.ten_ct ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Loại công trình">{data.loaicongtrinhcsvc?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Mục đích sử dụng">{data.mucdichsudungcsvc?.name ?? '—'}</Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            <Descriptions
                title="Thông số"
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={3} label="Đối tượng sử dụng">{data.doi_tuong_sd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Diện tích xây dựng (m²)">{data.dt_sxd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Vốn ban đầu">{data.von_bd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Vốn đầu tư">{data.von_dt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Tình trạng CSVC">{data.tinhtrangcsvc?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Hình thức sở hữu">{data.htsh?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="CT CSVC trong nhà">{data.ct_csvc_trongnha?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Số phòng ở công vụ">{data.so_phong_o_cong_vu_cho_cb_giangday ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Số chỗ ở cho CB giảng dạy">{data.so_cho_o_cho_cb_giangday ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            <Descriptions
                title="Trạng thái & Địa chỉ"
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={3} label="Tình trạng sử dụng">{data.tinh_trang_sd?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Ngày chuyển tình trạng">{data.ngay_chuyen_tt ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Địa chỉ">{data.diachi ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default CtkDetail
