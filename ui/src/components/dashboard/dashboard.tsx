'use client'
import React, { useState } from 'react';
import {
    ApartmentOutlined,
    ApiOutlined,
    DatabaseOutlined,
    DownOutlined,
    HomeOutlined,
    LockOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Space, theme, Dropdown, MenuProps, Typography } from 'antd';
import Link from 'next/link';
import { handleSignOut } from '@/app/(auth)/dang-nhap/actions';
import { usePathname, useRouter } from 'next/navigation';
import { getUserPermission } from '@/libs/getUserPermission';
import { Action, DeviceSubject, RoomSubject, UnitSubject, UserSubject } from '@/libs/enum';

const { Header, Sider, Content } = Layout;

const Dashboard = ({
    children, email, access_token, user
}: Readonly<{
    children: React.ReactNode; email: string, access_token: string, user: IUser
}>) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const router = useRouter();

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Đổi mật khẩu',
            icon: <LockOutlined />,
            disabled: true,
        },
        {
            key: '2',
            label: 'Trang người dùng',
            icon: <HomeOutlined />,
            onClick: () => { router.push('/') }
        },
        {
            key: '3',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => { handleSignOut(access_token) }
        },
    ];
    const ability = getUserPermission(user);

    const rawMenuItems = [
        {
            key: '/quan-tri/trang-chu',
            icon: <HomeOutlined />,
            label: <Link href="/quan-tri/trang-chu">Trang chủ</Link>,
        },
        {
            key: '/quan-tri/thiet-bi',
            icon: <ApiOutlined />,
            label: <Link href="/quan-tri/thiet-bi">Thiết bị</Link>,
            permission: { action: Action.Read, subject: new DeviceSubject() },
        },
        {
            key: '/quan-tri/don-vi',
            icon: <ApartmentOutlined />,
            label: <Link href="/quan-tri/don-vi">Đơn vị</Link>,
            permission: { action: Action.Read, subject: new UnitSubject() },
        },
        {
            key: '/quan-tri/phong-kho',
            icon: <DatabaseOutlined />,
            label: <Link href="/quan-tri/phong-kho">Phòng - Kho</Link>,
            permission: { action: Action.Read, subject: new RoomSubject() },
        },
        {
            key: '/quan-tri/tai-khoan',
            icon: <UserOutlined />,
            label: <Link href="/quan-tri/tai-khoan">Tài khoản</Link>,
            permission: { action: Action.Manage, subject: new UserSubject() },
        },
    ];
    const menuItems = rawMenuItems.filter(item => {
        if (!item.permission) return true;

        const { action, subject } = item.permission;
        return ability.can(action, subject);
    });


    const pathname = usePathname()
    return (
        <Layout style={{ height: '100%', minHeight: '100vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    style={{ marginTop: 60 }}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Dropdown menu={{ items }}>
                        <a
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                height: 'auto',
                                lineHeight: 'normal',
                            }}
                            onClick={(e) => e.preventDefault()}>
                            <Space>
                                {email}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;