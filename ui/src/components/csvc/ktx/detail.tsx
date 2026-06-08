'use client'

import { Descriptions } from 'antd'

interface IProps {
    data: IKtx | null
}

const KtxDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={1} label="Mã KTX">{data.ma ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tên KTX">{data.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Diện tích (m²)">{data.dt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Sức chứa">{data.sc ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default KtxDetail
