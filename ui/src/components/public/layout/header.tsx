'use client'
import React from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];

const { Header } = Layout;

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: 64,
    background: '#fff',
    justifyContent: 'space-between',
    padding: '0 24px', // Padding chuẩn 2 bên
};

const MyHeader = ({ items, selectedKey }: { items: MenuItem[], selectedKey: string }) => {
    return (
        <Header style={headerStyle}>
            {/* Nhóm Logo + 2 dòng chữ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Image
                    style={{ padding: 4 }}
                    width={44}
                    height={44}
                    alt='logo'
                    src="/logo.png"
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                    <span style={{ fontWeight: 600, fontSize: 15, color: '#1f1f1f' }}>
                        Đại học Sư phạm Kỹ thuật Vĩnh Long
                    </span>
                    <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', marginTop: 2 }}>
                        Phòng Quản trị - Thiết bị
                    </span>
                </div>
            </div>

            {/* Menu */}
            <Menu
                style={{ padding: 0, background: '#fff' }}
                selectedKeys={[selectedKey]}
                mode="horizontal"
                items={items}
            />

            {/* Nút Đăng nhập */}
            <Link href={'/dang-nhap'} style={{ fontWeight: 500, color: '#1677ff' }}>
                Đăng nhập
            </Link>
        </Header>
    )
}
export default MyHeader