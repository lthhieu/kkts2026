"use client"
import { handleSignOut } from '@/app/(auth)/dang-nhap/actions';
import { handleChangePassword, handleUpdateInfo } from '@/app/(main)/actions';
import { Modal, Form, Input, message, notification } from 'antd';
import React, { useMemo } from 'react';

interface IProps {
    access_token?: string,
    isModalInfoOpen: boolean,
    setIsModalInfoOpen: (value: boolean) => void,
}
export interface IUpdateInfoDto {
    name: string,
    phone: string
}

const Context = React.createContext({ name: 'Default' });


const UpdateModal = (props: IProps) => {
    const { isModalInfoOpen, setIsModalInfoOpen, access_token } = props
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalInfoOpen(false);
    };

    const onFinish = async (values: IUpdateInfoDto) => {
        const { name, phone } = values
        const data = { name, phone }
        const response = await handleUpdateInfo(data, access_token ?? '')

        if (response.data) {
            messageApi.success(response.message);
            handleCancel()
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
                title={"Cập nhật thông tin"}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalInfoOpen}
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
                    name="info-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Họ tên"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default UpdateModal;