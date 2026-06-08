'use client'

import { Descriptions } from 'antd'

interface IProps {
    data: IPhongchucnang | null
}

const PhongchucnangDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={1} label="Mã phòng">{data.ma ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tên phòng">{data.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Loại phòng">{data.type?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Diện tích xây dựng (m²)">{data.dtxd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default PhongchucnangDetail
