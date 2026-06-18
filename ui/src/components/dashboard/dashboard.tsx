'use client'
import React, { useMemo, useState } from 'react';
import {
    ApartmentOutlined,
    ApiOutlined,
    BankOutlined,
    BuildOutlined,
    DatabaseOutlined,
    DownOutlined,
    ExperimentOutlined,
    HomeOutlined,
    LockOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReadOutlined,
    ToolOutlined,
    UnorderedListOutlined,
    UserOutlined, DiffOutlined, RadarChartOutlined,
    FormOutlined,
    EnvironmentOutlined,
    AlertOutlined,
    CompassOutlined,
    CameraOutlined,
    NodeIndexOutlined,
    FireOutlined,
    DeploymentUnitOutlined,
    BookOutlined,
    LaptopOutlined,
    CoffeeOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Space, theme, Dropdown, MenuProps } from 'antd';
import Link from 'next/link';
import { handleSignOut } from '@/app/(auth)/dang-nhap/actions';
import { usePathname, useRouter } from 'next/navigation';
import { getUserPermission, AppAbility } from '@/libs/getUserPermission';
import { Action, CsvcSubject, DanhmucSubject, DeviceSubject, NewsSubject, UserSubject } from '@/libs/enum';
import ChangePasswordModal from '@/components/dashboard/change-password-modal';
import Image from 'next/image';
import UpdateModal from '@/components/dashboard/update.info';

const { Header, Sider, Content, Footer } = Layout;

type RawMenuItem = {
    key: string;
    icon?: React.ReactNode;
    label: React.ReactNode;
    permission?: { action: Action; subject: any };
    children?: RawMenuItem[];
};

function filterItems(items: RawMenuItem[], ability: AppAbility): RawMenuItem[] {
    return items.reduce<RawMenuItem[]>((acc, item) => {
        if (item.permission && !ability.can(item.permission.action, item.permission.subject)) {
            return acc;
        }
        if (item.children) {
            const filteredChildren = filterItems(item.children, ability);
            if (filteredChildren.length === 0) return acc;
            acc.push({ ...item, children: filteredChildren });
        } else {
            acc.push(item);
        }
        return acc;
    }, []);
}

const Dashboard = ({
    children, email, access_token, user
}: Readonly<{
    children: React.ReactNode; email: string, access_token: string, user: IUser
}>) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isModalOpen, SetIsModalOpen] = useState(false)
    const [isModalInfoOpen, setIsModalInfoOpen] = useState(false)
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const router = useRouter();
    const pathname = usePathname();

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Đổi mật khẩu',
            icon: <LockOutlined />,
            onClick: () => { showModal() }
        },
        {
            key: '4',
            label: 'Cập nhật thông tin',
            icon: <UserOutlined />,
            onClick: () => { showModalInfo() }
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

    const rawMenuItems: RawMenuItem[] = [
        {
            key: '/quan-tri/trang-chu',
            icon: <HomeOutlined />,
            label: <Link href="/quan-tri/trang-chu">Trang chủ</Link>,
        },
        {
            key: 'thiet-bi-group',
            icon: <ApiOutlined />,
            label: 'Thiết bị',
            permission: { action: Action.Read, subject: new DeviceSubject() },
            children: [
                {
                    key: '/quan-tri/de-nghi',
                    icon: <DiffOutlined />,
                    label: <Link href="/quan-tri/de-nghi">Đề nghị</Link>,
                },
                {
                    key: '/quan-tri/kiem-ke',
                    icon: <RadarChartOutlined />,
                    label: <Link href="/quan-tri/kiem-ke">Kiểm kê</Link>,
                },
                {
                    key: '/quan-tri/don-vi',
                    icon: <ApartmentOutlined />,
                    label: <Link href="/quan-tri/don-vi">Đơn vị</Link>,
                },
                {
                    key: '/quan-tri/phong-kho',
                    icon: <DatabaseOutlined />,
                    label: <Link href="/quan-tri/phong-kho">Phòng - Kho</Link>,
                },
                {
                    key: '/quan-tri/thiet-biv2',
                    icon: <ApiOutlined />,
                    label: <Link href="/quan-tri/thiet-biv2">Thiết bị</Link>,
                },
            ],
        },
        {
            key: 'csvc-group',
            icon: <BuildOutlined />,
            label: 'Cơ sở vật chất',
            permission: { action: Action.Read, subject: new CsvcSubject() },
            children: [
                {
                    key: 'csvc-danhmuc-group',
                    icon: <UnorderedListOutlined />,
                    label: 'Danh mục',
                    permission: { action: Action.Read, subject: new DanhmucSubject() },
                    children: [
                        {
                            key: '/quan-tri/csvc/danh-muc/loai-phong',
                            label: <Link href="/quan-tri/csvc/danh-muc/loai-phong">Loại phòng</Link>,
                        }
                    ],
                },
                {
                    key: '/quan-tri/csvc/dat-dai',
                    icon: <EnvironmentOutlined />,
                    label: <Link href="/quan-tri/csvc/dat-dai">Đất đai</Link>,
                },
                {
                    key: '/quan-tri/csvc/toa-nha',
                    icon: <BankOutlined />,
                    label: <Link href="/quan-tri/csvc/toa-nha">Tòa nhà</Link>,
                },
                {
                    key: '/quan-tri/csvc/ly-thuyet',
                    icon: <AlertOutlined />,
                    label: <Link href="/quan-tri/csvc/ly-thuyet">Lý thuyết</Link>,
                },
                {
                    key: '/quan-tri/csvc/hoi-truong',
                    icon: <CompassOutlined />,
                    label: <Link href="/quan-tri/csvc/hoi-truong">Hội trường</Link>,
                },
                {
                    key: '/quan-tri/csvc/da-phuong-tien',
                    icon: <CameraOutlined />,
                    label: <Link href="/quan-tri/csvc/da-phuong-tien">Đa phương tiện</Link>,
                },
                {
                    key: '/quan-tri/csvc/thuc-hanh',
                    icon: <ToolOutlined />,
                    label: <Link href="/quan-tri/csvc/thuc-hanh">Thực hành</Link>,
                },
                {
                    key: '/quan-tri/csvc/thi-nghiem',
                    icon: <ExperimentOutlined />,
                    label: <Link href="/quan-tri/csvc/thi-nghiem">Thí nghiệm</Link>,
                },
                {
                    key: '/quan-tri/csvc/nghien-cuu',
                    icon: <NodeIndexOutlined />,
                    label: <Link href="/quan-tri/csvc/nghien-cuu">Nghiên cứu</Link>,
                },
                {
                    key: '/quan-tri/csvc/pgs-gs',
                    icon: <FireOutlined />,
                    label: <Link href="/quan-tri/csvc/pgs-gs">PGS-GS</Link>,
                },
                {
                    key: '/quan-tri/csvc/cho-lam-viec-cua-giang-vien',
                    icon: <BookOutlined />,
                    label: <Link href="/quan-tri/csvc/cho-lam-viec-cua-giang-vien">Chỗ làm việc của GV</Link>,
                },
                {
                    key: '/quan-tri/csvc/thu-vien',
                    icon: <ReadOutlined />,
                    label: <Link href="/quan-tri/csvc/thu-vien">Thư viện</Link>,
                },
                {
                    key: '/quan-tri/csvc/ktx',
                    icon: <HomeOutlined />,
                    label: <Link href="/quan-tri/csvc/ktx">Ký túc xá</Link>,
                },
                {
                    key: '/quan-tri/csvc/nha-xuong',
                    icon: <DeploymentUnitOutlined />,
                    label: <Link href="/quan-tri/csvc/nha-xuong">Nhà xưởng</Link>,
                },

                {
                    key: '/quan-tri/csvc/danh-sach-may-toan-truong',
                    icon: <LaptopOutlined />,
                    label: <Link href="/quan-tri/csvc/danh-sach-may-toan-truong">Danh sách máy toàn trường</Link>,
                },
                {
                    key: '/quan-tri/csvc/phong-chucnang',
                    icon: <CoffeeOutlined />,
                    label: <Link href="/quan-tri/csvc/phong-chucnang">Phòng chức năng</Link>,
                },
                {
                    key: '/quan-tri/csvc/thiet-bi-tren-500-trieu',
                    icon: <DollarOutlined />,
                    label: <Link href="/quan-tri/csvc/thiet-bi-tren-500-trieu">Thiết bị trên 500 triệu</Link>,
                },
            ],
        },
        {
            key: 'tin-tuc-group',
            icon: <FormOutlined />,
            label: 'Tin tức',
            permission: { action: Action.Read, subject: new NewsSubject() },
            children: [
                {
                    key: '/quan-tri/tin-tuc',
                    icon: <FormOutlined />,
                    label: <Link href="/quan-tri/tin-tuc">Tin tức</Link>,
                },
            ],
        },
        {
            key: '/quan-tri/tai-khoan',
            icon: <UserOutlined />,
            label: <Link href="/quan-tri/tai-khoan">Tài khoản</Link>,
            permission: { action: Action.Read, subject: new UserSubject() },
        },
    ];

    const menuItems = useMemo(() => filterItems(rawMenuItems, ability), [user]);

    const defaultOpenKeys = useMemo(() => {
        const keys: string[] = [];
        if (pathname.startsWith('/quan-tri/thiet-bi') || pathname.startsWith('/quan-tri/de-nghi') ||
            pathname.startsWith('/quan-tri/kiem-ke') || pathname.startsWith('/quan-tri/don-vi') ||
            pathname.startsWith('/quan-tri/phong-kho')) {
            keys.push('thiet-bi-group');
        }
        if (pathname.startsWith('/quan-tri/csvc')) {
            keys.push('csvc-group');
            if (pathname.startsWith('/quan-tri/csvc/danh-muc')) {
                keys.push('csvc-danhmuc-group');
            }
        }
        if (pathname.startsWith('/quan-tri/tin-tuc')) {
            keys.push('tin-tuc-group');
        }
        return keys;
    }, [pathname]);

    const showModal = () => {
        SetIsModalOpen(true);
    }
    const showModalInfo = () => {
        setIsModalInfoOpen(true);
    }
    return (
        <Layout style={{ height: '100%', minHeight: '100vh' }}>
            <Sider
                width={260}
                breakpoint="lg"
                collapsedWidth="0"
                trigger={null} collapsible collapsed={collapsed}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        style={{ padding: 4, marginTop: 8 }}
                        width={44}
                        height={44}
                        alt='logo'
                        src="/logo.png" />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname]}
                    defaultOpenKeys={defaultOpenKeys}
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
                <Footer style={{ textAlign: 'center', background: colorBgContainer, padding: 12 }}>©{new Date().getFullYear()} Trường Đại học Sư phạm Kỹ thuật Vĩnh Long</Footer>
            </Layout>
            <ChangePasswordModal
                isModalOpen={isModalOpen}
                setIsModalOpen={SetIsModalOpen}
                access_token={access_token}
            />
            <UpdateModal
                isModalInfoOpen={isModalInfoOpen}
                setIsModalInfoOpen={setIsModalInfoOpen}
                access_token={access_token}
            />
        </Layout>
    );
};

export default Dashboard;
