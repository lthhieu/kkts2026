'use client'

import { Descriptions } from 'antd'

interface IProps {
    data: ITBTren500tr | null
}

const TBTren500trDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={'filled'} label="Tên tài sản">{data.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Mã Tài sản cố định">{data.code ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Mô tả">{data.description ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Đơn vị">{data.unit?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={1} label="Năm sử dụng">{data.yearUse ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Số lượng">{data.quantity ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Nguyên giá">{data.originalPrice ? data.originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Ghi chú">{data.note ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default TBTren500trDetail
