'use client'

import { Descriptions } from 'antd'

interface IProps {
    data: ICsvcSubject | null
}

const HoitruongDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={1} label="Mã phòng">{data.ma ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tên phòng">{data.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Diện tích (m²)">{data.dt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Số chỗ ngồi">{data.qui_mo_cho_ngoi ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default HoitruongDetail
