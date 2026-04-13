'use client'

import { Descriptions, Divider } from 'antd'

interface IProps {
    data: ITbiptn | null
}

const TbiptnDetail = ({ data }: IProps) => {
    if (!data) return null

    return (
        <div>
            <Descriptions
                title="Thông tin thiết bị"
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={3} label="Mã thiết bị">{data.ma_tb ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Tên thiết bị">{data.ten_tb ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Công trình CSVC">{data.ma_ct_csvc?.ten_ct ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sản xuất">{data.nam_sx ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Xuất xứ">{data.xuatxu?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="SL thiết bị cùng loại">{data.sl_tb_cungloai ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={2} label="Hãng sản xuất">{data.hang_sx ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">{data.nam_sd ?? '—'}</Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            <Descriptions
                title="Trạng thái"
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item span={3} label="Tình trạng sử dụng">{data.tinh_trang_sd?.name ?? '—'}</Descriptions.Item>
                <Descriptions.Item span={3} label="Ngày chuyển tình trạng">{data.ngay_chuyen_tt ?? '—'}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default TbiptnDetail
