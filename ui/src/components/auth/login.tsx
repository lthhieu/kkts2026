'use client'

import { Button, Divider, Form, Grid, Input, notification, theme, Typography } from "antd";

import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { authenticate, } from "@/app/(auth)/dang-nhap/actions";
import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title } = Typography;
const Context = React.createContext({ name: 'Default' });


export default function LoginComponent() {
    const { token } = useToken();
    const router = useRouter();
    const screens = useBreakpoint();
    const [api, contextHolder] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/quan-tri/trang-chu';

    const onFinish = async (values: any) => {
        const res = await authenticate(values.username, values.password);
        if (!res?.error) {
            router.push(callbackUrl)
        } else {
            api.error({
                title: `Có lỗi xảy ra`,
                description: res.error,
                placement: 'topRight',
            });
        }
    };

    const styles = {
        container: {
            margin: "0 auto",
            padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
            width: "380px",
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG,
        },
        footer: {
            marginTop: token.marginLG,
            textAlign: "center",
            width: "100%"
        },
        header: {
            marginBottom: token.marginXL
        },
        section: {
            alignItems: "center",
            backgroundColor: token.colorBgContainer,
            display: "flex",
            height: screens.sm ? "100vh" : "auto",
            padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
        },
        text: {
            color: token.colorTextSecondary
        },
        title: {
            fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
        }
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}
            <section style={styles.section}>
                <div style={styles.container}>
                    <div style={styles.header}>

                        <Title style={{ ...styles.title, textAlign: 'center' }}>Đăng nhập</Title>
                    </div>
                    <Form
                        name="login"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark="optional"
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    type: "email",
                                    required: true,
                                    message: "Email không được để trống!",
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Email"
                            />
                        </Form.Item>
                        <Form.Item
                            style={{ margin: 0 }}
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Mật khẩu không được để trống!",
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Mật khẩu"
                            />
                        </Form.Item>
                        <Form.Item style={{ margin: '10px 0' }}>
                            <a style={{ float: 'right' }} href="">
                                Quên mật khẩu?
                            </a>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "0px" }}>
                            <Button block={true} type="primary" htmlType="submit">
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider plain>Hoặc</Divider>
                    <Button icon={<GoogleOutlined />} block={true} type="default" onClick={() => signIn("google")}>
                        Đăng nhập với tài khoản Google
                    </Button>
                </div>
            </section>
        </Context.Provider>

    );
}