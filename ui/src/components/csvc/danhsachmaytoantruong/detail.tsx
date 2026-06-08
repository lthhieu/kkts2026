'use client'

import { MayCateLabel } from '@/components/csvc/danhsachmaytoantruong/modal'
import { Descriptions } from 'antd'

interface IProps {
    data: IMaytoantruong | null
}

const MaytoantruongDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={'filled'} label="Tên Tài sản cố định">{data.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Mã số / Mô tả Tài sản cố định">{data.des ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Đơn vị">{data.unit?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Phòng">{data.room?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={1} label="Số lượng">{data.sl ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={'filled'} label="Nguyên giá (Theo sổ kế toán)">{data.nguyengia ? data.nguyengia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '—'}</Descriptions.Item>
                <Descriptions.Item label="Loại tài sản">{data.cate ? MayCateLabel[data.cate] : '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default MaytoantruongDetail
