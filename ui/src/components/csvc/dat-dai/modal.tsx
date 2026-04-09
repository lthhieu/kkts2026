'use client'
import { Modal, Form, Input, message, Select, Row, Col, InputNumber, notification, DatePicker } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { handleCreateOrUpdateDatdai } from '@/app/(main)/quan-tri/csvc/dat-dai/actions';

interface IProps {
    access_token?: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    status: string;
    setStatus: (value: string) => void;
    dataUpdate: null | IDatdai;
    setDataUpdate: (value: null | IDatdai) => void;
    hinhthucsudung: IHinhthucsudung[];
    mucdichsudungdat: IMucdichsudungdat[];
    tinhtrangsudung: ITinhtrangsudung[];
    tinhthanhpho: ITinhthanhpho[];
    xaphuong: IXaphuong[];
}

const Context = React.createContext({ name: 'Default' });

const DatdaiModal = (props: IProps) => {
    const {
        setIsModalOpen, isModalOpen, setStatus, status, access_token,
        setDataUpdate, dataUpdate,
        hinhthucsudung, mucdichsudungdat, tinhtrangsudung, tinhthanhpho, xaphuong,
    } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedTinh, setSelectedTinh] = useState<string | undefined>(undefined);

    const filteredXaphuong = useMemo(
        () => selectedTinh ? xaphuong.filter((x) => (x.tinhthanhpho as any)?._id === selectedTinh || x.tinhthanhpho === selectedTinh as any) : [],
        [xaphuong, selectedTinh]
    );

    useEffect(() => {
        if (dataUpdate) {
            const tinhId = dataUpdate.tinhthanhpho?._id ?? undefined;
            setSelectedTinh(tinhId);
            form.setFieldsValue({
                ma_giay_cnqsh: dataUpdate.ma_giay_cnqsh,
                dt: dataUpdate.dt,
                htsd: dataUpdate.htsd?._id ?? null,
                cqsh: dataUpdate.cqsh,
                minh_chung_qshd: dataUpdate.minh_chung_qshd,
                muc_dich_shd: dataUpdate.muc_dich_shd?._id ?? null,
                nam_bd_sdd: dataUpdate.nam_bd_sdd,
                tg_sdd: dataUpdate.tg_sdd,
                dtd_da_sd: dataUpdate.dtd_da_sd,
                tinh_trang_sd: dataUpdate.tinh_trang_sd?._id ?? null,
                ngay_chuyen_tt: dataUpdate.ngay_chuyen_tt ? dayjs(dataUpdate.ngay_chuyen_tt, ['DD/MM/YYYY', 'YYYY-MM-DD']) : null,
                tinhthanhpho: tinhId ?? null,
                xaphuong: dataUpdate.xaphuong?._id ?? null,
                diachi: dataUpdate.diachi,
            });
        }
    }, [dataUpdate]);

    const handleOk = () => { form.submit(); };

    const handleCancel = () => {
        form.resetFields();
        setSelectedTinh(undefined);
        setStatus('');
        setDataUpdate(null);
        setIsModalOpen(false);
    };

    const onFinish = async (values: any) => {
        const payload = {
            ...values,
            ngay_chuyen_tt: values.ngay_chuyen_tt ? values.ngay_chuyen_tt.format('DD/MM/YYYY') : null,
        };
        const response = await handleCreateOrUpdateDatdai(payload, access_token ?? '', status, dataUpdate);
        if (response.data) {
            messageApi.success(response.message);
            handleCancel();
        } else {
            api.error({ title: 'Có lỗi xảy ra', description: response.message, placement: 'topRight' });
        }
    };

    const validateMessages = { required: '${label} không được để trống' };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={status === 'CREATE' ? 'Thêm đất đai' : 'Cập nhật đất đai'}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Đồng ý"
                cancelText="Hủy"
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%' }}
            >
                <Form
                    form={form}
                    autoComplete="off"
                    layout="vertical"
                    name="datdai-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    initialValues={{ nam_bd_sdd: new Date().getFullYear(), tg_sdd: 0, dtd_da_sd: 0 }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Mã giấy CNQSH" name="ma_giay_cnqsh" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Diện tích (m²)" name="dt" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Hình thức sử dụng" name="htsd" rules={[{ required: true }]}>
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={hinhthucsudung.map(({ _id, name }) => ({ value: _id, label: name }))} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Cơ quan sở hữu" name="cqsh" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Minh chứng QSHD" name="minh_chung_qshd" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Mục đích sử dụng đất" name="muc_dich_shd">
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={mucdichsudungdat.map(({ _id, name }) => ({ value: _id, label: name }))} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Năm bắt đầu SDD" name="nam_bd_sdd" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Thời gian SDD (năm)" name="tg_sdd" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Diện tích đã SD (m²)" name="dtd_da_sd" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Tình trạng sử dụng" name="tinh_trang_sd">
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={tinhtrangsudung.map(({ _id, name }) => ({ value: _id, label: name }))} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Tỉnh / Thành phố" name="tinhthanhpho" rules={[{ required: true }]}>
                                <Select
                                    allowClear
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder="Vui lòng chọn"
                                    options={tinhthanhpho.map(({ _id, name }) => ({ value: _id, label: name }))}
                                    onChange={(val) => {
                                        setSelectedTinh(val);
                                        form.setFieldValue('xaphuong', null);
                                    }}
                                    onClear={() => {
                                        setSelectedTinh(undefined);
                                        form.setFieldValue('xaphuong', null);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Xã / Phường" name="xaphuong" rules={[{ required: true }]}>
                                <Select
                                    allowClear
                                    showSearch={{ optionFilterProp: 'label' }}
                                    placeholder={selectedTinh ? 'Vui lòng chọn' : 'Chọn tỉnh/thành phố trước'}
                                    disabled={!selectedTinh}
                                    options={filteredXaphuong.map(({ _id, name }) => ({ value: _id, label: name }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Ngày chuyển tình trạng" name="ngay_chuyen_tt">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Địa chỉ" name="diachi">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default DatdaiModal;
