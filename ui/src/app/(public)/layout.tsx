'use client'
import React, { useState } from 'react';
import { Button, Flex, Grid, Layout, MenuProps } from 'antd';
import MyHeader from '@/components/public/layout/header';
import { HomeOutlined, AppstoreOutlined, FileTextOutlined, ProjectOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Link from 'next/link';
import MySider from '@/components/public/layout/sider';
type MenuItem = Required<MenuProps>['items'][number];
const { useBreakpoint } = Grid;

const { Footer, Content, Header } = Layout;


const contentStyle: React.CSSProperties = {
    paddingTop: 16,
    background: '#fff',
    padding: "0 5%"
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    background: '#fff',
};

const layoutStyle = {
    overflow: 'hidden',
    width: '100%',
    height: '100%', minHeight: '100vh'
};

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

const PublicLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Flex gap="middle" wrap>
            <Layout style={{ ...layoutStyle, margin: isMobile ? "" : "0 5%" }}>
                {isMobile && <MySider items={items} collapsed={collapsed} setCollapsed={setCollapsed} />}
                <Layout>
                    {isMobile && <Header style={{ background: '#fff', padding: 0 }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        /></Header>}
                    {!isMobile && <MyHeader items={items} />}
                    <Content style={contentStyle}>{children}</Content>
                    <Footer style={footerStyle}>©{new Date().getFullYear()} Trường Đại học Sư phạm Kỹ thuật Vĩnh Long</Footer>
                </Layout>
            </Layout>
        </Flex>
    )
};

export default PublicLayout;