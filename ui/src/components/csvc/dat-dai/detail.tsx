'use client'

import { Descriptions, Divider } from 'antd'

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
                <Descriptions.Item label="Diện tích (m²)">{data.dt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Hình thức sử dụng">{data.htsd?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Cơ quan sở hữu">{data.cqsh ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Minh chứng QSHD">{data.minh_chung_qshd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Mục đích sử dụng đất">{data.muc_dich_shd?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm bắt đầu SDD">{data.nam_bd_sdd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Thời gian SDD (năm)">{data.tg_sdd ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Diện tích đã SD (m²)">{data.dtd_da_sd ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tình trạng sử dụng">{data.tinh_trang_sd?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Ngày chuyển tình trạng">{data.ngay_chuyen_tt ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Tỉnh / Thành phố">{data.tinhthanhpho?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Xã / Phường">{data.xaphuong?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Địa chỉ">{data.diachi ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default DatdaiDetail
