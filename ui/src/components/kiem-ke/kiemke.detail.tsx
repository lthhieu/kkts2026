'use client'

import { Typography, Tag, Divider, Timeline, Descriptions, Space } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { STATUS_COLOR_MAP, STATUS_LABEL_MAP } from '@/components/thiet-bi/table';
import dayjs from 'dayjs';

interface IProps {
    device: ISnapshot | null;
}

const KiemKeDetail = ({ device }: IProps) => {
    if (!device) return null;

    // Format số tiền
    const formatMoney = (value: number | null | undefined) => {
        if (value === null || value === undefined) return '—';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div >
            {/* Thông tin cơ bản */}
            <Descriptions
                size="default"
                column={{ xs: 1, sm: 3, md: 3 }}
            >
                <Descriptions.Item label="Tên thiết bị" span={3}>
                    {device.name}
                </Descriptions.Item>
                <Descriptions.Item label="Mã số/Mô tả" span={3}>
                    {device.description || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Đơn vị">
                    {device.unit || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú">
                    {device.note || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Loại thiết bị">
                    <Tag color={device.type === 'Tài sản cố định' ? 'blue' : device.type === 'Công cụ dụng cụ' ? 'cyan' : 'gold'}>
                        {device.type}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Năm sử dụng">
                    {device.usedYear}
                </Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ khấu hao">
                    {device.trongSoChatLuong}%
                </Descriptions.Item>
                <Descriptions.Item label="Chất lượng còn lại">
                    {device.chatLuongConLai}%
                </Descriptions.Item>
                <Descriptions.Item label="Phòng hiện tại">
                    <Tag color="default">{device.room || '—'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={STATUS_COLOR_MAP[device.status!] || 'default'} variant='outlined'>
                        {STATUS_LABEL_MAP[device.status!] || device.status}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            {/* Sổ kế toán */}
            <Descriptions
                title="Sổ kế toán"
                column={{ xs: 1, sm: 3, md: 3 }}
            >
                <Descriptions.Item label="Số lượng">
                    {device.soKeToan?.soLuong ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Nguyên giá">
                    {formatMoney(device.soKeToan?.nguyenGia)}
                </Descriptions.Item>
                <Descriptions.Item label="Giá trị còn lại">
                    {formatMoney(device.soKeToan?.giaTriConLai)}
                </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            {/* Kiểm kê */}
            <Descriptions
                title="Kiểm kê"
                column={{ xs: 1, sm: 3, md: 3 }}
            >
                <Descriptions.Item label="Số lượng">
                    {device.kiemKe?.soLuong ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Nguyên giá">
                    {formatMoney(device.kiemKe?.nguyenGia)}
                </Descriptions.Item>
                <Descriptions.Item label="Giá trị còn lại">
                    {formatMoney(device.kiemKe?.giaTriConLai)}
                </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            {/* Chênh lệch */}
            <Descriptions
                title="Chênh lệch"
                column={{ xs: 1, sm: 3, md: 3 }}
            >
                <Descriptions.Item label="Thừa">
                    {device.chenhLech?.thua ?? 0}
                </Descriptions.Item>
                <Descriptions.Item label="Thiếu">
                    {device.chenhLech?.thieu ?? 0}
                </Descriptions.Item>
                <Descriptions.Item label="Giá trị còn lại">
                    {formatMoney(device.chenhLech?.giaTriConLai)}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default KiemKeDetail;