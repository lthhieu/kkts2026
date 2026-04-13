'use client'

import { Descriptions } from 'antd'

interface IProps {
    data: IPhgdht | null
}

const PhgdhtDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item label="Mã PHGDHT">{data.ma_phgdht ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tên phòng">{data.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Diện tích (m²)">{data.dt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Hình thức sở hữu">{data.htsh?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Quy mô chỗ ngồi">{data.qui_mo_cho_ngoi ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Tình trạng CSVC">{data.tinhtrangcsvc?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Phân loại">{data.phanloai?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Loại phòng học">{data.loaiphonghoc?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Loại đề án">{data.loaidean?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tình trạng sử dụng">{data.tinh_trang_sd?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Ngày chuyển tình trạng">{data.ngay_chuyen_tt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>{data.diachi ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default PhgdhtDetail
