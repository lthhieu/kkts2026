'use client'

import { Descriptions } from 'antd'

interface IProps {
    data: IPtn | null
}

const PtnDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={3} label="Công trình CSVC">{data.ma_ct_csvc?.ten_ct ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Loại PTN">{data.loai_ptn?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Phục vụ ngành">{data.phuc_vu_nganh?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Mức độ đáp ứng nhu cầu NCKH">{data.muc_do_dap_ung_nhu_cau_nckh ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default PtnDetail
