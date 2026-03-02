'use client'
import { Card, Col, Row, Typography } from 'antd';
import { news } from '@/components/public/fake.data.news';
import Link from 'next/link';
const { Paragraph } = Typography;

const TinTucComponent = () => (
    <Row wrap={true} gutter={[16, 16]}>
        {news.length > 0 ? news.map((item) => {
            return (
                <Col key={item._id} span={6}>
                    <Link href={`/tin-tuc/${item._id}`} style={{ textDecoration: 'none' }}>
                        <Card hoverable styles={{ body: { padding: 8 } }} cover={
                            <img
                                draggable={false}
                                alt={item.title}
                                src={item.image}
                            />
                        }>
                            <Paragraph
                                ellipsis={{ rows: 2, tooltip: item.title }}
                                style={{ margin: 0, fontWeight: 500, color: '#333' }}
                            >
                                {item.title}
                            </Paragraph>
                        </Card>
                    </Link>
                </Col>
            )
        }) : <></>}
    </Row>
);

export default TinTucComponent;