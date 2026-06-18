'use client'

import { Typography, Tag, Divider, Timeline, Descriptions, Space } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { STATUS_COLOR_MAP, STATUS_LABEL_MAP } from '@/components/thietbiv2/table';
import { typeArr } from '@/components/thietbiv2/table';

interface IProps {
    device: IDeviceV2 | null;
}

const DeviceDetail = ({ device }: IProps) => {
    if (!device) return null;

    // Format số tiền
    const formatMoney = (value: number | null | undefined) => {
        if (value === null || value === undefined) return '—';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const typeInfo = typeArr.find(
        item => item.value === device.type
    );

    return (
        <div >
            {/* Thông tin cơ bản */}
            <Descriptions
                size="default"
                column={{ xs: 1, sm: 3 }}
            >
                <Descriptions.Item label="Tên thiết bị" span={'filled'}>
                    {device.name}
                </Descriptions.Item>
                <Descriptions.Item label="Mã số/Mô tả" span={'filled'}>
                    {device?.description || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Giáo viên quản lý" span={'filled'}>
                    {device.currentRoom?.length
                        ? [...new Map(
                            device.currentRoom.flatMap(r => r.users || [])
                                .filter(u => u?.name)
                                .map(u => [u.name, u]) // key = name để lọc trùng
                        ).values()]
                            .map(u => u.phone ? `${u.name} (${u.phone})` : u.name)
                            .join(', ') || '—'
                        : '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Đơn vị" span={'filled'}>
                    {device?.unit?.name || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Loại thiết bị">
                    <Descriptions.Item label="Loại thiết bị">
                        <Tag>
                            {typeInfo?.label ?? device.type}
                        </Tag>
                    </Descriptions.Item>
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
                <Descriptions.Item label="Trạng thái" span={2}>
                    <Tag color={STATUS_COLOR_MAP[device.status!] || 'default'} variant='outlined'>
                        {STATUS_LABEL_MAP[device.status!] || device.status}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Phòng hiện tại" span={'filled'}>
                    <Tag color="default">{device.currentRoom.map(room => room?.name).filter(Boolean).join(', ') || '—'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú" span={'filled'}>
                    {device.note || '—'}
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
                <Descriptions.Item label="Tổng nguyên giá" span={'filled'}>
                    {device.totalSoKeToanNguyenGia || '—'}
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
                <Descriptions.Item label="Tổng nguyên giá" span={'filled'}>
                    {device.totalKiemKeNguyenGia || '—'}
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

            <Divider style={{ margin: '16px 0' }} />

            {/* Lịch sử nơi sử dụng */}
            <Typography.Title level={5} style={{ marginBottom: 12 }}>
                Lịch sử nơi sử dụng
            </Typography.Title>

            {device.usedLocation && device.usedLocation.length > 0 ? (
                <Timeline
                    items={device.usedLocation.map((location, index) => ({
                        color: 'green',
                        icon: <EnvironmentOutlined />,
                        content: (
                            <Space>
                                <Tag color="blue">{location.year}</Tag>
                                <Tag>{location.room.map(room => room?.name).filter(Boolean).join(', ') || '—'}</Tag>
                                {location.reason && <Typography.Text>{location.reason} ({location.person})</Typography.Text>}
                            </Space>
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