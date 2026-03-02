'use client'
import { Layout, Menu, MenuProps } from 'antd';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
type MenuItem = Required<MenuProps>['items'][number];

const { Sider } = Layout;
const MySider = ({ items, collapsed, setCollapsed }: { items: MenuItem[], collapsed: boolean, setCollapsed: (v: boolean) => void }) => {
    const pathname = usePathname()

    return (
        <Sider
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
                style={{}}
                theme="dark"
                mode="inline"
                selectedKeys={[pathname]}
                items={items}
                onClick={() => setCollapsed(true)}
            />
        </Sider>
    )
}
export default MySider