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
    gap: 64,
    textAlign: 'center',
    height: 64,
    lineHeight: '64px',
    background: '#fff',
    justifyContent: 'space-between'
};
const MyHeader = ({ items, selectedKey }: { items: MenuItem[], selectedKey: string }) => {
    return (<>
        <Header style={headerStyle}>
            <Image
                style={{ padding: 4 }}
                width={44}
                height={44}
                alt='logo'
                src="/logo.png" />
            <Menu style={{ padding: 0, background: '#fff' }} selectedKeys={[selectedKey]} mode="horizontal" items={items} />
            <Link href={'/dang-nhap'}>Đăng nhập</Link>
        </Header></>
    )
}
export default MyHeader