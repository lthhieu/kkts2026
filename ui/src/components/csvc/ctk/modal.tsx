'use client'
import { Modal, Form, Input, message, Select, Row, Col, InputNumber, notification, DatePicker } from 'antd';
import React, { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { handleCreateOrUpdateCtk } from '@/app/(main)/quan-tri/csvc/ctk/actions';

interface IProps {
    access_token?: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    status: string;
    setStatus: (value: string) => void;
    dataUpdate: null | ICtk;
    setDataUpdate: (value: null | ICtk) => void;
    loaicongtrinhcsvc: ILoaicongtrinhcsvc[];
    mucdichsudungcsvc: IMucdichsudungcsvc[];
    tinhtrangcsvc: ITinhtrangcsvc[];
    hinhthucsohuu: IHinhthucsohuu[];
    luachon: ILuachon[];
    tinhtrangsudung: ITinhtrangsudung[];
}

const Context = React.createContext({ name: 'Default' });

const CtkModal = (props: IProps) => {
    const {
        setIsModalOpen, isModalOpen, setStatus, status, access_token,
        setDataUpdate, dataUpdate,
        loaicongtrinhcsvc, mucdichsudungcsvc, tinhtrangcsvc, hinhthucsohuu, luachon, tinhtrangsudung,
    } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                ma_ct: dataUpdate.ma_ct,
                ten_ct: dataUpdate.ten_ct,
                loaicongtrinhcsvc: dataUpdate.loaicongtrinhcsvc?._id ?? null,
                mucdichsudungcsvc: dataUpdate.mucdichsudungcsvc?._id ?? null,
                doi_tuong_sd: dataUpdate.doi_tuong_sd,
                dt_sxd: dataUpdate.dt_sxd,
                von_bd: dataUpdate.von_bd,
                von_dt: dataUpdate.von_dt,
                tinhtrangcsvc: dataUpdate.tinhtrangcsvc?._id ?? null,
                htsh: dataUpdate.htsh?._id ?? null,
                ct_csvc_trongnha: dataUpdate.ct_csvc_trongnha?._id ?? null,
                so_phong_o_cong_vu_cho_cb_giangday: dataUpdate.so_phong_o_cong_vu_cho_cb_giangday,
                so_cho_o_cho_cb_giangday: dataUpdate.so_cho_o_cho_cb_giangday,
                nam_sd: dataUpdate.nam_sd,
                diachi: dataUpdate.diachi,
                tinh_trang_sd: dataUpdate.tinh_trang_sd?._id ?? null,
                ngay_chuyen_tt: dataUpdate.ngay_chuyen_tt ? dayjs(dataUpdate.ngay_chuyen_tt, ['DD/MM/YYYY', 'YYYY-MM-DD']) : null,
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
            ngay_chuyen_tt: values.ngay_chuyen_tt ? values.ngay_chuyen_tt.format('DD/MM/YYYY') : null,
        };
        const response = await handleCreateOrUpdateCtk(payload, access_token ?? '', status, dataUpdate);
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
                title={status === 'CREATE' ? 'Thêm công trình CSVC' : 'Cập nhật công trình CSVC'}
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
                    name="ctk-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    initialValues={{ nam_sd: new Date().getFullYear(), von_bd: 0, von_dt: 0, so_phong_o_cong_vu_cho_cb_giangday: 0, so_cho_o_cho_cb_giangday: 0 }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Mã công trình" name="ma_ct" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Tên công trình" name="ten_ct" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Loại công trình CSVC" name="loaicongtrinhcsvc" rules={[{ required: true }]}>
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={loaicongtrinhcsvc.map(({ _id, name }) => ({ value: _id, label: name }))} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Mục đích sử dụng CSVC" name="mucdichsudungcsvc" rules={[{ required: true }]}>
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={mucdichsudungcsvc.map(({ _id, name }) => ({ value: _id, label: name }))} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Đối tượng sử dụng" name="doi_tuong_sd" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="DT xây dựng (m²)" name="dt_sxd" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Vốn ban đầu (triệu đồng)" name="von_bd">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Vốn đầu tư (triệu đồng)" name="von_dt">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Tình trạng CSVC" name="tinhtrangcsvc" rules={[{ required: true }]}>
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={tinhtrangcsvc.map(({ _id, name }) => ({ value: _id, label: name }))} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Hình thức sở hữu" name="htsh">
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={hinhthucsohuu.map(({ _id, name }) => ({ value: _id, label: name }))} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Công trình CSVC trong nhà" name="ct_csvc_trongnha" rules={[{ required: true }]}>
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={luachon.map(({ _id, name }) => ({ value: _id, label: name }))} />
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
                            <Form.Item style={{ marginBottom: 8 }} label="Số phòng ở công vụ CB giảng dạy" name="so_phong_o_cong_vu_cho_cb_giangday">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Số chỗ ở cho CB giảng dạy" name="so_cho_o_cho_cb_giangday">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Tình trạng sử dụng" name="tinh_trang_sd">
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={tinhtrangsudung.map(({ _id, name }) => ({ value: _id, label: name }))} />
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

export default CtkModal;
