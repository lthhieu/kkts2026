'use client'

import { Typography, Tag, Divider, Timeline, Descriptions } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

interface IProps {
    device: IDevice | null;
}

const DeviceDetail = ({ device }: IProps) => {
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
                    {device.unit?.name || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú">
                    {device.note || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Loại thiết bị">
                    <Tag color={device.type === 'Tài sản cố định' ? 'blue' : 'green'}>
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
                    <Tag color={
                        (device.chatLuongConLai ?? 0) >= 80 ? 'green' :
                            (device.chatLuongConLai ?? 0) >= 50 ? 'orange' : 'red'
                    }>
                        {device.chatLuongConLai}%
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Phòng hiện tại">
                    <Tag color="green">{device.currentRoom?.name || '—'}</Tag>
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
                    <Tag color={device.chenhLech?.thua ? 'green' : 'default'}>
                        {device.chenhLech?.thua ?? 0}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thiếu">
                    <Tag color={device.chenhLech?.thieu ? 'red' : 'default'}>
                        {device.chenhLech?.thieu ?? 0}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Giá trị còn lại">
                    {formatMoney(device.chenhLech?.giaTriConLai)}
                </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            {/* Lịch sử nơi sử dụng */}
            <Typography.Title level={5} style={{ marginBottom: 12 }}>
                Lịch sử nơi sử dụng
            </Typography.Title>

            {device.usedLocation && device.usedLocation.length > 0 ? (
                <Timeline
                    items={device.usedLocation.map((location, index) => ({
                        color: index === 0 ? 'green' : 'gray',
                        icon: <EnvironmentOutlined />,
                        content: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Tag color="blue">{location.year}</Tag>
                                <span>{location.room?.name || '—'}</span>
                            </div>
                        ),
                    }))}
                />
            ) : (
                <Typography.Text type="secondary">Chưa có thông tin nơi sử dụng</Typography.Text>
            )}
        </div>
    );
};

export default DeviceDetail;