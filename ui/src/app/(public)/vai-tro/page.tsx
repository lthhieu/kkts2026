'use client'
import React from 'react';
import { Tabs, Typography } from 'antd';
import type { TabsProps } from 'antd';

const { Text } = Typography;

const onChange = (key: string) => {
    console.log(key);
};

const ChucNang = () => {
    return (<div style={{ padding: '0 20px' }}>
        <ul style={{ lineHeight: '2' }}>
            <li>
                <Text>Phòng Quản trị - Thiết bị có chức năng tham mưu, giúp việc cho Hiệu trưởng trong các mặt công tác sau:</Text>
                {/* Tạo list con để thụt lề cho phó phòng */}
                <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                    <li><Text>Quản lý và sử dụng cơ sở vật chất của Trường.</Text></li>
                    <li><Text>Xây dựng và tổ chức thực hiện các dự án đầu tư máy móc, trang thiết bị cho giảng dạy và học tập.</Text></li>
                    <li><Text>Theo dõi sử dụng hiệu quả tài sản của trường phục vụ cho giảng dạy, nghiên cứu khoa học và học tập.</Text></li>
                    <li><Text>Tham mưu cho Hiệu trưởng về công tác quản trị.</Text></li>
                </ul>
            </li>

            <li><Text>Email: qttb@vlute.edu.vn</Text></li>
        </ul>
    </div>)
}
const NhiemVu = () => {
    return (<div style={{ padding: '0 20px' }}>
        <ul style={{ lineHeight: '2' }}>
            <li>
                <Text>Công tác quản trị:</Text>
                {/* Tạo list con để thụt lề cho phó phòng */}
                <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                    <li><Text>Quản lý, bảo dưỡng cơ sở hạ tầng, bao gồm: Phòng làm việc, xưởng thực hành, ban ghế, thiết bị hỗ trợ làm việc, hàng rào, hệ thống giao thông trong Trường, hệ thống cống rãnh, hệ thống cung cấp điện nước, hệ thống iện thoại trong trường đảm bảo thông tin thông suốt.</Text></li>
                    <li><Text>Phối hợp với các bộ phận liên quan triển khai công tác phòng, chống bão lụt, phòng cháy, chữa cháy trong Trường.</Text></li>
                    <li><Text>Lập kế hoạch và tổ chức sửa chữa nhà cửa, công trình công cộng, thiết bị máy móc, bàn ghế, tủ, bảng,... bị hư hỏng của tất cả các đơn vị trong Trường.</Text></li>
                    <li><Text>Phối hợp với các đơn vị chức năng có liên quan, lập kế hoạch xây dựng và nghiệm thu các công trình xây dựng mới, công trình sửa chữa, cải tạo lớn nhận bàn giao và có kế hoạch đưa các công trình đó vào sử dụng có hiệu quả.</Text></li>
                    <li><Text>Xây dựng và tổ chức kiểm tra việc thực hiện quy định sử dụng tài sản, thiết bị của các đơn vị, đánh giá chất lượng, giá trị sử dụng các trang thiết bị để có kế hoạch mua sắm, chống hư hỏng, mất mát, lãng phí.</Text></li>
                    <li><Text>Giám sát việc sửa chữa, nâng cấp hệ thống điện, nước, vệ sinh môi trường và các công trình kiến trúc theo quy định.</Text></li>
                    <li><Text>Đảm bảo điều kiện làm việc cho các đơn vị, đoàn thể, hoạt động đào tạo và nghiên cứu khoa học. Quản lý các phòng học chung.</Text></li>
                    <li><Text>Quản lý, khai thác, sử dụng hệ thống điện, nước, các công trình kiến trúc.</Text></li>
                    <li><Text>Quản lý và sử dụng có hiệu quả lao động, tài sản được giao theo quy định pháp luật hiện hành của trường.</Text></li>
                    <li><Text>Quản lý đội ngũ cán bộ, viên chức, lao động hợp đồng và tài sản được giao theo quy định.</Text></li>
                    <li><Text>Thực hiện các nhiệm vụ khác do Giám Hiệu giao.</Text></li>
                </ul>
            </li>

            <li>
                <Text>Công tác thiêt bị:</Text>
                {/* Tạo list con để thụt lề cho phó phòng */}
                <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                    <li><Text>Quản lý toàn bộ hệ thống máy móc, trang thiết bị và các phương tiện khoa học kỹ thuật phục vụ cho đào tạo và tổ chức đào tạo.</Text></li>
                    <li><Text>Phối hợp với các đơn vị xây dựng kế hoạch mua sắm trang thiết bị, vật tư phục vụ đào tạo, nghiên cứu khoa học và hoạt động thường xuyên của Trường.</Text></li>
                    <li><Text>Xây dựng kế hoạch đấu thầu và tiến độ thực hiện các dự án về thiết bị, vật tư.</Text></li>
                    <li><Text>Giám sát việc sử dụng máy móc, trang thiết bị và các phương tiện khoa học kỹ thuật của các phòng khoa trong toàn trường.</Text></li>
                    <li><Text>Phối hợp với phòng Kế hoạch - Tài chính trong việc thực hiện các quy định về mua sắm, giám sát và theo dõi việc sử dụng thiết bị vật tư trong Trường.</Text></li>
                    <li><Text>Quản lý kho thiết bị, vật tư theo quy định.</Text></li>
                    <li><Text>Là thường trực trong các ban quản lý dự án đầu tư thiết bị, vật tư.</Text></li>
                </ul>
            </li>
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

const VaiTro: React.FC = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;

export default VaiTro;