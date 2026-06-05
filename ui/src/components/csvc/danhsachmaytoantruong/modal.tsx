'use client'
import { handleCreateOrUpdateMaytoantruong } from '@/app/(main)/quan-tri/csvc/danh-sach-may-toan-truong/actions';
import { Modal, Form, Input, message, Row, Col, InputNumber, notification, Select } from 'antd';
import React, { useEffect, useMemo } from 'react';

interface IProps {
    access_token?: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    status: string;
    setStatus: (value: string) => void;
    dataUpdate: null | IMaytoantruong;
    setDataUpdate: (value: null | IMaytoantruong) => void;
    rooms: IRoom[],
    units: IUnit[]
}

export enum MayCate {
    MAY_CAU_HINH_CAO = 'maycauhinhcao',
    LAPTOP_MAY_TINH_BANG = 'laptopmaytinhbang',
    TUONG_DUONG_THAP = 'tuongduongthap',
    MAY_IN = 'mayin',
    MAY_SCAN = 'mayscan',
}

export const MayCateLabel = {
    [MayCate.MAY_CAU_HINH_CAO]: 'Máy cấu hình cao',
    [MayCate.LAPTOP_MAY_TINH_BANG]: 'Laptop / Máy tính bảng',
    [MayCate.TUONG_DUONG_THAP]: 'Máy tương đương thấp',
    [MayCate.MAY_IN]: 'Máy in',
    [MayCate.MAY_SCAN]: 'Máy scan',
};

const Context = React.createContext({ name: 'Default' });

const MaytoantruongModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate, rooms, units } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                des: dataUpdate.des,
                "unit": dataUpdate?.unit ? dataUpdate.unit._id : null,
                room: dataUpdate?.room ? dataUpdate.room._id : null,
                nam_sd: dataUpdate.nam_sd,
                sl: dataUpdate.sl,
                nguyengia: dataUpdate.nguyengia,
                cate: dataUpdate.cate
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
        const response = await handleCreateOrUpdateMaytoantruong(payload, access_token ?? '', status, dataUpdate);
        if (response.data) {
            messageApi.success(response.message);
            handleCancel();
        } else {
            api.error({
                title: 'Có lỗi xảy ra',
                description: (response.message as any).join(', '),
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
                title={status === 'CREATE' ? 'Thêm tài sản cố định' : 'Cập nhật tài sản cố định'}
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
                    name="maytoantruong-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >

                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Tên Tài sản cố định"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Mã số / Mô tả Tài sản cố định"
                        name="des"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea autoSize />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Đơn vị"
                                name="unit"
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
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Phòng"
                                name="room"
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn phòng"
                                    options={
                                        rooms && rooms.length > 0
                                            ? rooms.map(({ _id, name }) => ({
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
                                label="Năm sử dụng"
                                name="nam_sd"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Số lượng"
                                name="sl"
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
                                label="Nguyên giá"
                                name="nguyengia"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Loại tài sản"
                                name="cate"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn loại tài sản"
                                    options={Object.values(MayCate).map((value) => ({
                                        value,
                                        label: MayCateLabel[value],
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default MaytoantruongModal;
