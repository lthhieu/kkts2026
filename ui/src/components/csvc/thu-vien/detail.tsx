'use client'

import { Descriptions } from 'antd'

interface IProps {
    data: ICsvcSubject | null
}

const ThuvienDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={2} label="Mã phòng">{data.ma ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tên phòng">{data.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Diện tích (m²)">{data.dt ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>

            </Descriptions>
        </div>
    )
}

export default ThuvienDetail
