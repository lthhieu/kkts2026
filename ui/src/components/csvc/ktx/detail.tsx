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
                <Descriptions.Item label="Mã KTX">{data.ma_ktx ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Hình thức sở hữu">{data.htsh?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Tổng số chỗ ở">{data.tong_so_cho_o ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Tổng diện tích (m²)">{data.tong_dt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Tình trạng CSVC">{data.tinhtrangcsvc?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Tổng số phòng ở SV">{data.tong_so_phong_o_sv ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tình trạng sử dụng">{data.tinh_trang_sd?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Ngày chuyển tình trạng">{data.ngay_chuyen_tt ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>{data.diachi ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default KtxDetail
