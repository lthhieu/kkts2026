'use client'
import React from 'react';
import { Flex, Layout } from 'antd';
import MyHeader from '@/components/public/layout/header';

const { Footer, Content } = Layout;


const contentStyle: React.CSSProperties = {
    paddingTop: 16,
    background: '#fff'
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    background: '#fff'
};

const layoutStyle = {
    overflow: 'hidden',
    width: '100%',
    height: '100%', minHeight: '100vh',
    margin: "0 5%"
};

const PublicLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => (
    <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
            <MyHeader />
            <Content style={contentStyle}>{children}</Content>
            <Footer style={footerStyle}>©{new Date().getFullYear()} Trường Đại học Sư phạm Kỹ thuật Vĩnh Long</Footer>
        </Layout>
    </Flex>
);

export default PublicLayout;