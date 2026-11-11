'use client'
import { Typography } from 'antd';


const { Text } = Typography;
const GioithieuComponent = () => {
    return (
        <div style={{ padding: '0 20px', marginTop: 32 }}>
            <ul style={{ lineHeight: '2',fontSize: '16px', listStyleType: 'none' }}>
                <li><strong>- Tên phòng:</strong> Quản trị - Thiết bị</li>
                <li><strong>- Tên tiếng Anh:</strong> Office of Equipment and Facilities Management</li>
                <li><strong>- Văn phòng:</strong> B106 (Nhà B, tầng 1)</li>
                <li><strong>- Trưởng phòng phụ trách:</strong> ThS. Nguyễn Văn Tám; Email: <span style={{ color: '#4275e4' }}>tamck@vlute.edu.vn</span></li>
        
                <li>
                    <strong>- Phó trưởng phòng:</strong>
                    {/* Tạo list con để thụt lề cho phó phòng */}
                    <ul style={{ listStyleType: 'circle', paddingLeft: '40px' }}>
                        <li>ThS. Nguyễn Thanh Hoàng; Email: <span style={{ color: '#4275e4' }}>hoangnt@vlute.edu.vn</span></li>
                        <li>ThS. Nguyễn Đức Thành; Email: <span style={{ color: '#4275e4' }}>thanhnd@vlute.edu.vn</span></li>
                    </ul>
                </li>

                <li><strong>- Email:</strong> qttb@vlute.edu.vn</li>
            </ul>
        </div>
    )
}
export default GioithieuComponent