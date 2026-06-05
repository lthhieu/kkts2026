'use client'
import { handleCreateOrUpdateCholamvieccuagv } from '@/app/(main)/quan-tri/csvc/cho-lam-viec-cua-giang-vien/actions';
import { Modal, Form, Input, message, Row, Col, InputNumber, notification } from 'antd';
import React, { useEffect, useMemo } from 'react';

interface IProps {
    access_token?: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    status: string;
    setStatus: (value: string) => void;
    dataUpdate: null | ICsvcSubject;
    setDataUpdate: (value: null | ICsvcSubject) => void;
}

const Context = React.createContext({ name: 'Default' });

const CholamvieccuagvModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                ma: dataUpdate.ma,
                name: dataUpdate.name,
                dt: dataUpdate.dt,
            });
        }
    }, [dataUpdate]);

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setStatus('');
        setDataUpdate(null);
        setIsModalOpen(false);
    };

    const onFinish = async (values: any) => {
        const payload = {
            ...values,
        };
        const response = await handleCreateOrUpdateCholamvieccuagv(payload, access_token ?? '', status, dataUpdate);
        if (response.data) {
            messageApi.success(response.message);
            handleCancel();
        } else {
            api.error({
                title: 'Có lỗi xảy ra',
                description: response.message,
                placement: 'topRight',
            });
        }
    };

    const validateMessages = {
        required: '${label} không được để trống',
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={status === 'CREATE' ? 'Thêm chỗ làm việc của giảng viên' : 'Cập nhật chỗ làm việc của giảng viên'}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Đồng ý"
                cancelText="Hủy"
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
                    layout="vertical"
                    name="cholamvieccuagv-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Mã phòng"
                                name="ma"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Tên phòng"
                                name="name"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Diện tích (m²)"
                        name="dt"
                        rules={[{ required: true }]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default CholamvieccuagvModal;
