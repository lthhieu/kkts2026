"use client"
import { handleSignOut } from '@/app/(auth)/dang-nhap/actions';
import { handleChangePassword } from '@/app/(main)/actions';
import { Modal, Form, Input, message, notification } from 'antd';
import React, { useMemo } from 'react';

interface IProps {
    access_token?: string,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
}
export interface IChangePasswordDto {
    oldPassword: string,
    newPassword: string
}

const Context = React.createContext({ name: 'Default' });


const ChangePasswordModal = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, access_token } = props
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (values: IChangePasswordDto) => {
        const { oldPassword, newPassword } = values
        const data = { oldPassword, newPassword }
        const response = await handleChangePassword(data, access_token ?? '')

        if (response.data) {
            messageApi.success(response.message);
            handleCancel()
            setTimeout(() => { handleSignOut(access_token!) }, 1000)
        } else {
            api.error({
                title: `Có lỗi xảy ra`,
                description: response.message,
                placement: 'topRight',
            });
        }
    }

    const validateMessages = {
        required: '${label} không được để trống',
    }

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={"Cập nhật mật khẩu"}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Đồng ý"}
                cancelText={"Hủy"}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}
            >
                <Form
                    form={form}
                    autoComplete="off"
                    layout='vertical'
                    name="change-password-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Mật khẩu cũ"
                        name="oldPassword"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Xác nhận mật khẩu mới"
                        name="confirmNewPassword"
                        rules={[{ required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Mật khẩu xác nhận không khớp')
                                );
                            },
                        }),
                        ]}
                        dependencies={['newPassword']} // 🔥 Quan trọng
                        validateTrigger="onChange"
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default ChangePasswordModal;