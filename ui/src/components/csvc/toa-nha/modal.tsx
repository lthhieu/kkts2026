'use client'
import { Modal, Form, Input, message, Select, Row, Col, InputNumber, notification } from 'antd';
import React, { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { handleCreateOrUpdateToanha } from '@/app/(main)/quan-tri/csvc/toa-nha/actions';

interface IProps {
    access_token?: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    status: string;
    setStatus: (value: string) => void;
    dataUpdate: null | IToanha;
    setDataUpdate: (value: null | IToanha) => void;
}

export const placeOptions = [
    { value: 0, label: `Trường SPKT` },
    { value: 1, label: `KTX SPKT` }
]

const Context = React.createContext({ name: 'Default' });

const ToanhaModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                ma_toanha: dataUpdate.ma_toanha,
                ten_toanha: dataUpdate.ten_toanha,
                dtxd: dataUpdate.dtxd,
                tong_dt_sxd: dataUpdate.tong_dt_sxd,
                so_tang: dataUpdate.so_tang,
                nam_sd: dataUpdate.nam_sd,
                place: dataUpdate.place || 0,
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
        const response = await handleCreateOrUpdateToanha(payload, access_token ?? '', status, dataUpdate);
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
                title={status === 'CREATE' ? 'Thêm tòa nhà' : 'Cập nhật tòa nhà'}
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
                    name="toanha-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Mã tòa nhà"
                                name="ma_toanha"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Tên tòa nhà"
                                name="ten_toanha"
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
                                label="Tổng DT sàn xây dựng (m²)"
                                name="tong_dt_sxd"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Số tầng"
                                name="so_tang"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Năm sử dụng"
                                name="nam_sd"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Vị trí"
                        name="place"
                    >
                        <Select
                            style={{ width: '100%' }}
                            showSearch={{ optionFilterProp: 'label' }}
                            placeholder="Chọn vị trí"
                            allowClear
                            options={placeOptions.map(({ value, label }) => ({ value, label }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default ToanhaModal;
