'use client'
import { Modal, Form, Input, message, Select, Row, Col, InputNumber, notification, DatePicker } from 'antd';
import React, { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { handleCreateOrUpdateThuvien } from '@/app/(main)/quan-tri/csvc/thu-vien/actions';

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

const ThuvienModal = (props: IProps) => {
    const {
        setIsModalOpen, isModalOpen, setStatus, status, access_token,
        setDataUpdate, dataUpdate,
    } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                ma: dataUpdate.ma,
                name: dataUpdate.name,
                nam_sd: dataUpdate.nam_sd,
                dt: dataUpdate.dt,

            });
        }
    }, [dataUpdate]);

    const handleOk = () => { form.submit(); };

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
        const response = await handleCreateOrUpdateThuvien(payload, access_token ?? '', status, dataUpdate);
        if (response.data) {
            messageApi.success(response.message);
            handleCancel();
        } else {
            api.error({ title: 'Có lỗi xảy ra', description: response.message, placement: 'topRight' });
        }
    };

    const validateMessages = { required: '${label} không được để trống' };
    const numDefault = 0;

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={status === 'CREATE' ? 'Thêm thư viện' : 'Cập nhật thư viện'}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Đồng ý"
                cancelText="Hủy"
                width={{ xs: '90%', sm: '85%', md: '75%', lg: '65%', xl: '55%', xxl: '45%' }}
            >
                <Form
                    form={form}
                    autoComplete="off"
                    layout="vertical"
                    name="thuvien-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Mã phòng" name="ma" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Tên phòng" name="name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Năm sử dụng" name="nam_sd" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Diện tích (m²)" name="dt" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default ThuvienModal;
