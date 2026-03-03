'use client'
import { Card, Col, Row, Typography } from 'antd';
import { news } from '@/components/public/fake.data.news';
import Link from 'next/link';
import Image from 'next/image';
const { Paragraph } = Typography;

const TinTucComponent = () => {
    console.log(news[0])
    return (
        <Row wrap={true} gutter={[16, 16]}>
            {news.length > 0 ? news.map((item) => {
                return (
                    <Col key={item._id} xs={24} md={6}>
                        <Link href={`/tin-tuc/${item.slug}`} style={{ textDecoration: 'none' }}>
                            <Card hoverable styles={{ body: { padding: 8 } }} cover={
                                <Image
                                    draggable={false}
                                    alt={news[0]?.slug ?? 'just a alt'}
                                    // src={news[0].image}
                                    src={item.image}
                                    width={270}
                                    height={150}
                                    style={{ objectFit: "cover" }}
                                />
                            }>
                                <Paragraph
                                    ellipsis={{ rows: 2, tooltip: news[0].title }}
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
    )
};

export default TinTucComponent;