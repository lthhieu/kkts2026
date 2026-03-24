'use client'
import { Card, Col, Row } from 'antd';
import { ApiOutlined, ApartmentOutlined, UserOutlined, DatabaseOutlined, DiffOutlined } from '@ant-design/icons';
import Link from 'next/link'; // 👈 Thêm import

const { Meta } = Card;

interface IProps {
    getData: IDatabase,
    access_token: string,
    role: string
}

// 👇 Cấu hình route đích cho từng card (thay bằng route thực tế của bạn)
const CARD_ROUTES = {
    devices: '/quan-tri/thiet-bi',
    units: '/quan-tri/don-vi',
    rooms: '/quan-tri/phong-kho',
    users: '/quan-tri/tai-khoan',
    requests: '/quan-tri/de-nghi'
};

const linkStyle: React.CSSProperties = {
    display: 'block',
    height: '100%',
    textDecoration: 'none',
    color: 'inherit'
};

const cardStyle: React.CSSProperties = {
    height: '100%',
    transition: 'all 0.2s'
};

const Home = (props: IProps) => {
    const { getData, access_token, role } = props;

    if (access_token === '' || role === 'guest') return (
        <div style={{ lineHeight: 3 }}>
            <strong>Kính chào Quý Thầy/Cô.</strong>
            <div style={{ lineHeight: 1.5 }}>
                <p>Để thuận tiện trong việc sử dụng hệ thống, kính đề nghị Quý Thầy/Cô vui lòng liên hệ Quản trị viên để được xem xét và phân quyền phù hợp.</p>
                <p>Trân trọng.</p>
            </div>
        </div>
    );

    return (
        <Row wrap={true} gutter={[16, 16]}>
            <Col xs={24} md={6}>
                <Link href={CARD_ROUTES.devices} style={linkStyle}>
                    <Card hoverable style={cardStyle}>
                        <Meta avatar={<ApiOutlined />} title="Tổng số thiết bị:" />
                        <p style={{ marginTop: 12, fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{getData.devices}</p>
                    </Card>
                </Link>
            </Col>
            <Col xs={24} md={6}>
                <Link href={CARD_ROUTES.units} style={linkStyle}>
                    <Card hoverable style={cardStyle}>
                        <Meta avatar={<ApartmentOutlined />} title="Tổng số đơn vị:" />
                        <p style={{ marginTop: 12, fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{getData.units}</p>
                    </Card>
                </Link>
            </Col>
            <Col xs={24} md={6}>
                <Link href={CARD_ROUTES.rooms} style={linkStyle}>
                    <Card hoverable style={cardStyle}>
                        <Meta avatar={<DatabaseOutlined />} title="Tổng số phòng-kho:" />
                        <p style={{ marginTop: 12, fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{getData.rooms}</p>
                    </Card>
                </Link>
            </Col>
            <Col xs={24} md={6}>
                <Link href={CARD_ROUTES.users} style={linkStyle}>
                    <Card hoverable style={cardStyle}>
                        <Meta avatar={<UserOutlined />} title="Tổng số tài khoản:" />
                        <p style={{ marginTop: 12, fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{getData.users}</p>
                    </Card>
                </Link>
            </Col>
            <Col xs={24} md={6}>
                <Link href={CARD_ROUTES.requests} style={linkStyle}>
                    <Card hoverable style={cardStyle}>
                        <Meta avatar={<DiffOutlined />} title="Tổng số đề nghị:" />
                        <p style={{ marginTop: 12, fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{getData.requests}</p>
                    </Card>
                </Link>
            </Col>
        </Row>
    )
};

export default Home;