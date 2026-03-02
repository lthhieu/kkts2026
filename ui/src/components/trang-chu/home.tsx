'use client'
import { Card, Col, Row } from 'antd';
import { ApiOutlined, ApartmentOutlined, UserOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Meta } = Card;
interface IProps {
    getData: IDatabase,
    access_token: string,
    role: string
}
const Home = (props: IProps) => {
    const { getData, access_token, role } = props
    if (access_token === '' || role === 'guest') return <>Trang chủ</>
    return (
        <Row wrap={true} gutter={[16, 16]}>
            <Col span={6}>
                <Card>
                    <Meta
                        avatar={<ApiOutlined />}
                        title="Tổng số thiết bị:"
                        description={getData.devices}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Meta
                        avatar={<ApartmentOutlined />}
                        title="Tổng số đơn vị:"
                        description={getData.units}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Meta
                        avatar={<DatabaseOutlined />}
                        title="Tổng số phòng-kho:"
                        description={getData.rooms}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Meta
                        avatar={<UserOutlined />}
                        title="Tổng số tài khoản:"
                        description={getData.users}
                    />
                </Card>
            </Col>
        </Row>
    )
};

export default Home;