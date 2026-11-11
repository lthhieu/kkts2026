'use client'
import { Tabs, Typography } from 'antd';
import type { TabsProps } from 'antd';

const { Text } = Typography;

export const ChucNang = () => {
    return (<div style={{ padding: '0 20px' }}>
        <ul style={{ lineHeight: '2',fontSize: '16px', listStyleType: 'none', paddingLeft: '0' }}>
            <li>
                Tham mưu cho Hiệu trưởng trong công tác quản lý và tổ chức thực hiện các lĩnh vực:
                {/* Tạo list con để thụt lề cho phó phòng */}
                <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
                    <li>- Quản lý, khai thác cơ sở vật chất.</li>
                    <li>- Đầu tư xây dựng, hạ tầng kỹ thuật, trang thiết bị và cung ứng vật tư.</li>
                </ul>
            </li>
        </ul>
    </div>)
}
export const NhiemVu = () => {
    return (
        <div style={{ padding: '0 20px' }}>
    <ul style={{ lineHeight: '2', fontSize: '16px', listStyleType: 'none', paddingLeft: '0' }}>
        <li>- Thực hiện kiểm kê và cập nhật tài sản cố định hàng năm.</li>
        <li>- Tổ chức quản lý, khai thác, sử dụng hiệu quả cơ sở vật chất.</li>
        <li>- Kiểm tra, bảo dưỡng, nâng cấp nhà, xưởng và các hạng mục công trình.</li>
        <li>- Quản lý các hợp đồng khai thác cơ sở vật chất và các dịch vụ.</li>
        <li>- Lập kế hoạch, đăng tải và quản lý công tác đấu thầu trên hệ thống.</li>
        <li>- Tổ chức thực hiện, giám sát và quản lý hồ sơ các dự án, công trình.</li>
        <li>- Thực hiện mua sắm trang thiết bị, vật tư và các thủ tục thanh toán.</li>
        <li>- Đảm bảo điều kiện vật chất, kỹ thuật phục vụ đào tạo và các hoạt động khác.</li>
        <li>- Xây dựng các quy định, thống kê số liệu và thực hiện báo cáo.</li>
        <li>- Thực hiện các nhiệm vụ khác do Hiệu trưởng giao.</li>
    </ul>
</div>)
}

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Chức năng',
        children: <ChucNang />,
    },
    {
        key: '2',
        label: 'Nhiệm vụ',
        children: <NhiemVu />,
    },
];
const VaiTroComponent = () => {
    return (
        <Tabs style={{ marginTop: 8 }} defaultActiveKey="1" items={items} />
    )
}
export default VaiTroComponent