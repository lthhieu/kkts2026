'use client'
import React, { useState } from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import { HomeOutlined, AppstoreOutlined, FileTextOutlined, ProjectOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: <Link href="/">Giới thiệu</Link>,
        key: '/',
        icon: <HomeOutlined />,
    },
    {
        label: <Link href="/vai-tro">Vai trò</Link>,
        key: '/vai-tro',
        icon: <AppstoreOutlined />,
    },
    {
        label: <Link href="/tin-tuc">Tin tức</Link>,
        key: '/tin-tuc',
        icon: <FileTextOutlined />,
    },
    {
        label: <Link href="/tai-lieu">Tài liệu</Link>,
        key: '/tai-lieu',
        icon: <ProjectOutlined />,
    },
];

const { Header } = Layout;

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 64,
    textAlign: 'center',
    height: 64,
    lineHeight: '64px',
    background: '#fff'
};
const MyHeader = () => {
    const pathname = usePathname()

    return (<>
        <Header style={headerStyle}>
            <Image
                style={{ padding: 4 }}
                width={44}
                height={44}
                alt='logo'
                src="/logo.png" />
            <Menu style={{ padding: 0, background: '#fff' }} selectedKeys={[pathname]} mode="horizontal" items={items} />
        </Header></>
    )
}
export default MyHeader