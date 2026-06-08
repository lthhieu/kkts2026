'use client'
import { handleCreateOrUpdateTBTren500tr } from '@/app/(main)/quan-tri/csvc/thiet-bi-tren-500-trieu/actions';
import { Modal, Form, Input, message, Row, Col, InputNumber, notification, Select, Switch } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

interface IProps {
    access_token?: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    status: string;
    setStatus: (value: string) => void;
    dataUpdate: null | ITBTren500tr;
    setDataUpdate: (value: null | ITBTren500tr) => void;
    units: IUnit[] | null;
    availableChildren: { _id: string, code: string, name: string }[] | null;
}

const Context = React.createContext({ name: 'Default' });

const TBTren500trModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate, units, availableChildren } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const [isParentAsset, setIsParentAsset] = useState(false);
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate && availableChildren?.length) {
            setIsParentAsset(
                (dataUpdate.childrenIds?.length ?? 0) > 0,
            );

            form.setFieldsValue({
                name: dataUpdate.name,
                code: dataUpdate?.code ?? '',
                description: dataUpdate?.description ?? '',
                unit: dataUpdate.unit?._id ?? null,
                yearUse: dataUpdate.yearUse,
                quantity: dataUpdate.quantity,
                originalPrice: dataUpdate?.originalPrice,
                note: dataUpdate?.note ?? '',
                childrenIds: dataUpdate.childrenIds ?? [],
            });
        }
    }, [dataUpdate, availableChildren]);

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
        const response = await handleCreateOrUpdateTBTren500tr(payload, access_token ?? '', status, dataUpdate);
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
                title={status === 'CREATE' ? 'Thêm thiết bị trên 500 triệu' : 'Cập nhật thiết bị trên 500 triệu'}
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
                    name="tbtren500tr-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Là tài sản cha"
                    >
                        <Switch
                            checked={isParentAsset}
                            onChange={setIsParentAsset}
                        />
                    </Form.Item>
                    {
                        isParentAsset && (
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Tài sản con"
                                name="childrenIds"
                            >
                                <Select
                                    mode="multiple"
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Chọn tài sản con"
                                    options={
                                        availableChildren?.map(item => ({
                                            value: item._id,
                                            label: item.name,
                                        })) ?? []
                                    }
                                />
                            </Form.Item>
                        )
                    }
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Tên tài sản"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea autoSize />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Mô tả"
                        name="description"
                    >
                        <Input />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Mã Tài sản cố định"
                                name="code"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Đơn vị"
                                name="unit"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn đơn vị"
                                    options={
                                        units && units.length > 0
                                            ? units.map(({ _id, name }) => ({
                                                value: _id,
                                                label: name
                                            }))
                                            : []
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Năm đưa vào sử dụng"
                                name="yearUse"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Nguyên giá"
                        name="originalPrice"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Ghi chú"
                        name="note"
                    >
                        <Input.TextArea autoSize />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default TBTren500trModal;