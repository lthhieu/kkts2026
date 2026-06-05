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
                <Descriptions.Item span={3} label="Mã phòng">{data.ma ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Tên phòng">{data.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Loại phòng">{data.type?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Diện tích xây dựng (m²)">{data.dtxd ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Năm đưa vào sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default PhongchucnangDetail
