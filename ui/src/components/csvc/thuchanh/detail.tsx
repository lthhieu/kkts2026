'use client'

import { Descriptions } from 'antd'

interface IProps {
    data: ICsvcSubject | null
}

const ThuchanhDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={1}
            >
                <Descriptions.Item label="Mã phòng">{data.ma ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Tên phòng">{data.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Diện tích (m²)">{data.dt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Số chỗ ngồi">{data.qui_mo_cho_ngoi ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default ThuchanhDetail
