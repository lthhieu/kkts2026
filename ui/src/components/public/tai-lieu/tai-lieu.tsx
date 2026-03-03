import { Tabs, Typography } from 'antd';
import type { TabsProps } from 'antd';
const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Văn bản quy định',
        children: 'Văn bản quy định',
    },
    {
        key: '2',
        label: 'Biểu mẫu',
        children: 'Biểu mẫu',
    },
];

const TaiLieuComponent = () => {
    return (
        <Tabs style={{ marginTop: 8 }} defaultActiveKey="1" items={items} />
    )
}
export default TaiLieuComponent