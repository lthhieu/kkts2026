'use client'
import { Card, Col, Row, Typography } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import PaginationTinTuc from '@/components/public/tin-tuc/pagination';
const { Paragraph } = Typography;
interface IProps {
    news: INews[],
    meta: IMeta,
}

const TinTucComponent = (props: IProps) => {
    const { news, meta } = props
    if (news.length < 1) return 'Đang cập nhật..'
    return (
        <>
            <Row wrap={true} gutter={[16, 16]}>
                {news.length > 0 ? news.map((item) => {
                    return (
                        <Col key={item._id} xs={24} md={6}>
                            <Link href={`/tin-tuc/${item.slug}`} style={{ textDecoration: 'none' }}>
                                <Card hoverable styles={{ body: { padding: 8 } }} cover={
                                    <Image
                                        draggable={false}
                                        alt={item.slug ?? 'just a alt'}
                                        // src={news[0].image}
                                        src={item.thumbnail}
                                        width={270}
                                        height={150}
                                        style={{ objectFit: "cover" }}
                                    />
                                }>
                                    <Paragraph
                                        ellipsis={{ rows: 2 }}
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
            <PaginationTinTuc meta={meta} />
        </>
    )
};

export default TinTucComponent;