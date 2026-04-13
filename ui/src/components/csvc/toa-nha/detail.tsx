'use client'

import { Descriptions } from 'antd'

interface IProps {
    data: IToanha | null
}

const ToanhaDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item label="Mã tòa nhà">{data.ma_toanha ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tên tòa nhà">{data.ten_toanha ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Diện tích xây dựng (m²)">{data.dtxd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Tổng diện tích sàn (m²)">{data.tong_dt_sxd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Số tầng">{data.so_tang ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Hình thức sở hữu">{data.htsh?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Tình trạng sử dụng">{data.tinh_trang_sd?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Ngày chuyển tình trạng">{data.ngay_chuyen_tt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{data.diachi ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default ToanhaDetail
