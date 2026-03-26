'use client'
import React, { useMemo, useState } from 'react';
import { Button, Flex, Grid, Layout, MenuProps } from 'antd';
import MyHeader from '@/components/public/layout/header';
import { HomeOutlined, AppstoreOutlined, FileTextOutlined, ProjectOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LoginOutlined } from '@ant-design/icons';
import Link from 'next/link';
import MySider from '@/components/public/layout/sider';
import { usePathname } from 'next/navigation';
type MenuItem = Required<MenuProps>['items'][number];
const { useBreakpoint } = Grid;

const { Footer, Content, Header } = Layout;


const contentStyle: React.CSSProperties = {
    paddingTop: 16,
    background: '#fff',
    padding: "0 5%",
    paddingBottom: 16
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    background: '#fff',
    borderTop: '1px solid #ccc',
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
        label: <Link href="/vai-tro">Chức năng-Nhiệm vụ</Link>,
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
const itemsMobile: MenuItem[] = [
    {
        label: <Link href="/">Giới thiệu</Link>,
        key: '/',
        icon: <HomeOutlined />,
    },
    {
        label: <Link href="/vai-tro">Chức năng-Nhiệm vụ</Link>,
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
    {
        label: <Link href="/dang-nhap">Đăng nhập</Link>,
        key: '/dang-nhap',
        icon: <LoginOutlined />,
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
    const pathname = usePathname()

    // Tính toán key cần active dựa trên pathname hiện tại
    const selectedKey = useMemo(() => {
        // Tìm item nào trong menu khớp với pathname
        const foundItem = items.find((item) => {
            const key = String(item?.key);

            // 1. Trường hợp đặc biệt: Trang chủ '/'
            // Chỉ active khi pathname đúng y chang là '/'
            if (key === '/') {
                return pathname === '/';
            }

            // 2. Trường hợp các trang con (ví dụ key là '/tin-tuc')
            // Active khi pathname là '/tin-tuc' HOẶC '/tin-tuc/abcd'
            // Dùng startsWith(`${key}/`) để tránh nhầm lẫn (ví dụ /tin-tuc và /tin-tuc-moi)
            return pathname === key || pathname.startsWith(`${key}/`);
        });

        return foundItem ? String(foundItem.key) : '';
    }, [pathname, items]);

    return (
        <Flex gap="middle" wrap>
            <Layout style={{ ...layoutStyle, margin: isMobile ? "" : "0 5%" }}>
                {isMobile && <MySider items={itemsMobile} collapsed={collapsed} setCollapsed={setCollapsed} selectedKey={selectedKey} />}
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
                    {!isMobile && <MyHeader items={items} selectedKey={selectedKey} />}
                    <Content style={contentStyle}>{children}</Content>
                    <Footer style={footerStyle}>
                        <div style={{ fontWeight: 500, marginBottom: 8 }}>
                            ©{new Date().getFullYear()} Trường Đại học Sư phạm Kỹ thuật Vĩnh Long
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.6 }}>
                            Địa chỉ: Số 73, Nguyễn Huệ, Phường Long Châu, Tỉnh Vĩnh Long
                            <br />
                            Email:{' '}
                            <a href="#" style={{ color: '#4275e4', textDecoration: 'none' }}>
                                spktvl@vlute.edu.vn
                            </a>
                        </div>
                    </Footer>
                </Layout>
            </Layout>
        </Flex>
    )
};

export default PublicLayout;