'use client'
import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const MyHome: React.FC = () => (
    <div style={{ padding: '0 20px' }}>
        <ul style={{ lineHeight: '2' }}> {/* lineHeight giúp các dòng cách nhau ra cho dễ đọc */}
            <li><Text>Tên phòng: Quản trị - Thiết bị</Text></li>
            <li><Text>Tên tiếng Anh: Office of Equipment and Facilities Management</Text></li>
            <li><Text>Văn phòng: B106 (Nhà B, tầng 1)</Text></li>
            <li><Text>Trưởng phòng phụ trách: ThS. Nguyễn Văn Tám; Email: <span style={{ color: '#4275e4' }}>tamck@vlute.edu.vn</span></Text></li>

            <li>
                <Text>Phó trưởng phòng:</Text>
                {/* Tạo list con để thụt lề cho phó phòng */}
                <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                    <li><Text>ThS. Nguyễn Thanh Hoàng; Email: <span style={{ color: '#4275e4' }}>hoangnt@vlute.edu.vn</span></Text></li>
                    <li><Text>ThS. Nguyễn Đức Hải; Email: <span style={{ color: '#4275e4' }}>haind@vlute.edu.vn</span></Text></li>
                </ul>
            </li>

            <li><Text>Email: qttb@vlute.edu.vn</Text></li>
        </ul>
    </div>
);

export default MyHome;