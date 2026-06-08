'use client'

import { Descriptions } from 'antd'

interface IProps {
    data: IDatdai | null
}

const DatdaiDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item label="Mã giấy CNQSH">{data.ma_giay_cnqsh ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Thửa">{data.thua ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Diện tích (m²)">{data.dt ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Địa chỉ">{data.diachi ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Ghi chú">{data.ghichu ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default DatdaiDetail
