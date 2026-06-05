'use client'
import { handleCreateOrUpdatePhongchucnang } from '@/app/(main)/quan-tri/csvc/phong-chucnang/actions';
import { Modal, Form, Input, message, Row, Col, InputNumber, notification, Select } from 'antd';
import React, { useEffect, useMemo } from 'react';

interface IProps {
    access_token?: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    status: string;
    setStatus: (value: string) => void;
    dataUpdate: null | IPhongchucnang;
    setDataUpdate: (value: null | IPhongchucnang) => void;
    types: null | ILoaiphong[]
}

const Context = React.createContext({ name: 'Default' });

const PhongchucnangModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate, types } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                ma: dataUpdate.ma,
                name: dataUpdate.name,
                dtxd: dataUpdate.dtxd,
                type: dataUpdate.type?._id,
                nam_sd: dataUpdate.nam_sd,
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
        const response = await handleCreateOrUpdatePhongchucnang(payload, access_token ?? '', status, dataUpdate);
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
                title={status === 'CREATE' ? 'Thêm phòng - chức năng' : 'Cập nhật phòng - chức năng'}
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
                    name="phongchucnang-modal"
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

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Diện tích xây dựng (m²)"
                                name="dtxd"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Loại phòng"
                                name="type"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn loại phòng"
                                    options={
                                        types && types.length > 0
                                            ? types.map(({ _id, name }) => ({
                                                value: _id,
                                                label: name
                                            }))
                                            : []
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Năm sử dụng"
                        name="nam_sd"
                        rules={[{ required: true }]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default PhongchucnangModal;
