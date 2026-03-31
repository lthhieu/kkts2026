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
    GlobalOutlined,
    EnvironmentOutlined,
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
                    key: '/quan-tri/thiet-bi',
                    icon: <ApiOutlined />,
                    label: <Link href="/quan-tri/thiet-bi">Thiết bị</Link>,
                },
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
            ],
        },
        {
            key: 'csvc-group',
            icon: <BuildOutlined />,
            label: 'CSVC',
            permission: { action: Action.Read, subject: new CsvcSubject() },
            children: [
                {
                    key: 'csvc-danhmuc-group',
                    icon: <UnorderedListOutlined />,
                    label: 'Danh mục',
                    permission: { action: Action.Read, subject: new DanhmucSubject() },
                    children: [
                        {
                            key: '/quan-tri/csvc/danh-muc/hinh-thuc-so-huu',
                            label: <Link href="/quan-tri/csvc/danh-muc/hinh-thuc-so-huu">Hình thức sở hữu</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/hinh-thuc-su-dung',
                            label: <Link href="/quan-tri/csvc/danh-muc/hinh-thuc-su-dung">Hình thức sử dụng</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/tinh-trang-su-dung',
                            label: <Link href="/quan-tri/csvc/danh-muc/tinh-trang-su-dung">Tình trạng sử dụng</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/tinh-trang-csvc',
                            label: <Link href="/quan-tri/csvc/danh-muc/tinh-trang-csvc">Tình trạng CSVC</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/phan-loai',
                            label: <Link href="/quan-tri/csvc/danh-muc/phan-loai">Phân loại</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/loai-phong-hoc',
                            label: <Link href="/quan-tri/csvc/danh-muc/loai-phong-hoc">Loại phòng học</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/loai-cong-trinh',
                            label: <Link href="/quan-tri/csvc/danh-muc/loai-cong-trinh">Loại công trình</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/loai-ptn',
                            label: <Link href="/quan-tri/csvc/danh-muc/loai-ptn">Loại PTN</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/loai-de-an',
                            label: <Link href="/quan-tri/csvc/danh-muc/loai-de-an">Loại đề án</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/muc-dich-sd-csvc',
                            label: <Link href="/quan-tri/csvc/danh-muc/muc-dich-sd-csvc">Mục đích SD CSVC</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/muc-dich-sd-dat',
                            label: <Link href="/quan-tri/csvc/danh-muc/muc-dich-sd-dat">Mục đích SD đất</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/linh-vuc-dao-tao',
                            label: <Link href="/quan-tri/csvc/danh-muc/linh-vuc-dao-tao">Lĩnh vực đào tạo</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/tinh-thanh-pho',
                            icon: <EnvironmentOutlined />,
                            label: <Link href="/quan-tri/csvc/danh-muc/tinh-thanh-pho">Tỉnh thành phố</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/xa-phuong',
                            icon: <EnvironmentOutlined />,
                            label: <Link href="/quan-tri/csvc/danh-muc/xa-phuong">Xã phường</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/quoc-gia',
                            icon: <GlobalOutlined />,
                            label: <Link href="/quan-tri/csvc/danh-muc/quoc-gia">Quốc gia</Link>,
                        },
                        {
                            key: '/quan-tri/csvc/danh-muc/lua-chon',
                            label: <Link href="/quan-tri/csvc/danh-muc/lua-chon">Lựa chọn</Link>,
                        },
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
                    key: '/quan-tri/csvc/phgdht',
                    icon: <ReadOutlined />,
                    label: <Link href="/quan-tri/csvc/phgdht">Phòng học/GĐ/HT</Link>,
                },
                {
                    key: '/quan-tri/csvc/ktx',
                    icon: <HomeOutlined />,
                    label: <Link href="/quan-tri/csvc/ktx">Ký túc xá</Link>,
                },
                {
                    key: '/quan-tri/csvc/ctk',
                    icon: <BuildOutlined />,
                    label: <Link href="/quan-tri/csvc/ctk">Công trình</Link>,
                },
                {
                    key: '/quan-tri/csvc/ptn',
                    icon: <ExperimentOutlined />,
                    label: <Link href="/quan-tri/csvc/ptn">Phòng thí nghiệm</Link>,
                },
                {
                    key: '/quan-tri/csvc/xth',
                    icon: <ToolOutlined />,
                    label: <Link href="/quan-tri/csvc/xth">Xưởng thực hành</Link>,
                },
                {
                    key: '/quan-tri/csvc/tbiptn',
                    icon: <ApiOutlined />,
                    label: <Link href="/quan-tri/csvc/tbiptn">Thiết bị PTN</Link>,
                },
                {
                    key: '/quan-tri/csvc/thu-vien',
                    icon: <ReadOutlined />,
                    label: <Link href="/quan-tri/csvc/thu-vien">Thư viện</Link>,
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
