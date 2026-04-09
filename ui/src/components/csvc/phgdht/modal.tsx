'use client'
import { Modal, Form, Input, message, Select, Row, Col, InputNumber, notification, DatePicker } from 'antd';
import React, { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { handleCreateOrUpdatePhgdht } from '@/app/(main)/quan-tri/csvc/phgdht/actions';

interface IProps {
    access_token?: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    status: string;
    setStatus: (value: string) => void;
    dataUpdate: null | IPhgdht;
    setDataUpdate: (value: null | IPhgdht) => void;
    hinhthucsohuu: IHinhthucsohuu[];
    tinhtrangcsvc: ITinhtrangcsvc[];
    phanloai: IPhanloai[];
    loaiphonghoc: ILoaiphonghoc[];
    loaidean: ILoaidean[];
    tinhtrangsudung: ITinhtrangsudung[];
}

const Context = React.createContext({ name: 'Default' });

const PhgdhtModal = (props: IProps) => {
    const {
        setIsModalOpen, isModalOpen, setStatus, status, access_token,
        setDataUpdate, dataUpdate,
        hinhthucsohuu, tinhtrangcsvc, phanloai, loaiphonghoc, loaidean, tinhtrangsudung,
    } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                ma_phgdht: dataUpdate.ma_phgdht,
                name: dataUpdate.name,
                dt: dataUpdate.dt,
                htsh: dataUpdate.htsh?._id ?? null,
                qui_mo_cho_ngoi: dataUpdate.qui_mo_cho_ngoi,
                tinhtrangcsvc: dataUpdate.tinhtrangcsvc?._id ?? null,
                phanloai: dataUpdate.phanloai?._id ?? null,
                loaiphonghoc: dataUpdate.loaiphonghoc?._id ?? null,
                loaidean: dataUpdate.loaidean?._id ?? null,
                nam_sd: dataUpdate.nam_sd,
                diachi: dataUpdate.diachi,
                tinh_trang_sd: dataUpdate.tinh_trang_sd?._id ?? null,
                ngay_chuyen_tt: dataUpdate.ngay_chuyen_tt ? dayjs(dataUpdate.ngay_chuyen_tt, ['DD/MM/YYYY', 'YYYY-MM-DD']) : null,
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
            ngay_chuyen_tt: values.ngay_chuyen_tt ? values.ngay_chuyen_tt.format('DD/MM/YYYY') : null,
        };
        const response = await handleCreateOrUpdatePhgdht(payload, access_token ?? '', status, dataUpdate);
        if (response.data) {
            messageApi.success(response.message);
            handleCancel();
        } else {
            api.error({ title: 'Có lỗi xảy ra', description: response.message, placement: 'topRight' });
        }
    };

    const validateMessages = {
        required: '${label} không được để trống',
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={status === 'CREATE' ? 'Thêm phòng học / giảng đường / hội trường' : 'Cập nhật phòng học / giảng đường / hội trường'}
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
                    name="phgdht-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    initialValues={{ nam_sd: new Date().getFullYear() }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Mã PHGDHT" name="ma_phgdht" rules={[{ required: true }]}>
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
                            <Form.Item style={{ marginBottom: 8 }} label="Diện tích (m²)" name="dt" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Quy mô chỗ ngồi" name="qui_mo_cho_ngoi" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Hình thức sở hữu" name="htsh" rules={[{ required: true }]}>
                                <Select
                                    allowClear
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn"
                                    options={hinhthucsohuu.map(({ _id, name }) => ({ value: _id, label: name }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Tình trạng CSVC" name="tinhtrangcsvc" rules={[{ required: true }]}>
                                <Select
                                    allowClear
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn"
                                    options={tinhtrangcsvc.map(({ _id, name }) => ({ value: _id, label: name }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Phân loại" name="phanloai" rules={[{ required: true }]}>
                                <Select
                                    allowClear
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn"
                                    options={phanloai.map(({ _id, name }) => ({ value: _id, label: name }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Loại phòng học" name="loaiphonghoc" rules={[{ required: true }]}>
                                <Select
                                    allowClear
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn"
                                    options={loaiphonghoc.map(({ _id, name }) => ({ value: _id, label: name }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Loại đề án" name="loaidean" rules={[{ required: true }]}>
                                <Select
                                    allowClear
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn"
                                    options={loaidean.map(({ _id, name }) => ({ value: _id, label: name }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Năm sử dụng" name="nam_sd" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Tình trạng sử dụng" name="tinh_trang_sd">
                                <Select
                                    allowClear
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn"
                                    options={tinhtrangsudung.map(({ _id, name }) => ({ value: _id, label: name }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Ngày chuyển tình trạng" name="ngay_chuyen_tt">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginBottom: 8 }} label="Địa chỉ" name="diachi" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default PhgdhtModal;
