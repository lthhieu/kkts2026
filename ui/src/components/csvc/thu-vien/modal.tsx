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
    dataUpdate: null | IThuvien;
    setDataUpdate: (value: null | IThuvien) => void;
    tinhtrangcsvc: ITinhtrangcsvc[];
    hinhthucsohuu: IHinhthucsohuu[];
    tinhtrangsudung: ITinhtrangsudung[];
}

const Context = React.createContext({ name: 'Default' });

const ThuvienModal = (props: IProps) => {
    const {
        setIsModalOpen, isModalOpen, setStatus, status, access_token,
        setDataUpdate, dataUpdate,
        tinhtrangcsvc, hinhthucsohuu, tinhtrangsudung,
    } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                ma_thuvien: dataUpdate.ma_thuvien,
                name: dataUpdate.name,
                nam_sd: dataUpdate.nam_sd,
                dt: dataUpdate.dt,
                dt_phongdoc: dataUpdate.dt_phongdoc,
                so_phong_doc: dataUpdate.so_phong_doc,
                soluong_maytinh: dataUpdate.soluong_maytinh,
                soluong_cho_ngoi_doc_sach: dataUpdate.soluong_cho_ngoi_doc_sach,
                soluong_sach: dataUpdate.soluong_sach,
                soluong_tapchi: dataUpdate.soluong_tapchi,
                soluong_sach_dien_tu: dataUpdate.soluong_sach_dien_tu,
                soluong_tapchi_dien_tu: dataUpdate.soluong_tapchi_dien_tu,
                soluong_thu_vien_lien_ket_trong_nuoc: dataUpdate.soluong_thu_vien_lien_ket_trong_nuoc,
                soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai: dataUpdate.soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai,
                tinhtrangcsvc: dataUpdate.tinhtrangcsvc?._id ?? null,
                htsh: dataUpdate.htsh?._id ?? null,
                soluong_dau_sach: dataUpdate.soluong_dau_sach,
                soluong_dau_tap_chi: dataUpdate.soluong_dau_tap_chi,
                soluong_dau_sach_dien_tu: dataUpdate.soluong_dau_sach_dien_tu,
                soluong_dau_tap_chi_dien_tu: dataUpdate.soluong_dau_tap_chi_dien_tu,
                diachi: dataUpdate.diachi,
                tinh_trang_sd: dataUpdate.tinh_trang_sd?._id ?? null,
                ngay_chuyen_tt: dataUpdate.ngay_chuyen_tt ? dayjs(dataUpdate.ngay_chuyen_tt, ['DD/MM/YYYY', 'YYYY-MM-DD']) : null,
                so_dau_sach_dien_tu_co_truy_cap_truc_tuyen: dataUpdate.so_dau_sach_dien_tu_co_truy_cap_truc_tuyen,
                so_dau_sach_co_ban_in: dataUpdate.so_dau_sach_co_ban_in,
                so_dau_sach_in_co_the_muon_truc_tiep: dataUpdate.so_dau_sach_in_co_the_muon_truc_tiep,
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
                    initialValues={{
                        nam_sd: new Date().getFullYear(),
                        dt: numDefault, dt_phongdoc: numDefault, so_phong_doc: numDefault,
                        soluong_maytinh: numDefault, soluong_cho_ngoi_doc_sach: numDefault,
                        soluong_sach: numDefault, soluong_tapchi: numDefault,
                        soluong_sach_dien_tu: numDefault, soluong_tapchi_dien_tu: numDefault,
                        soluong_thu_vien_lien_ket_trong_nuoc: numDefault, soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai: numDefault,
                        soluong_dau_sach: numDefault, soluong_dau_tap_chi: numDefault,
                        soluong_dau_sach_dien_tu: numDefault, soluong_dau_tap_chi_dien_tu: numDefault,
                        so_dau_sach_dien_tu_co_truy_cap_truc_tuyen: numDefault,
                        so_dau_sach_co_ban_in: numDefault, so_dau_sach_in_co_the_muon_truc_tiep: numDefault,
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Mã thư viện" name="ma_thuvien" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Tên thư viện" name="name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Năm sử dụng" name="nam_sd">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Diện tích (m²)" name="dt">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="DT phòng đọc (m²)" name="dt_phongdoc">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Số phòng đọc" name="so_phong_doc">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL máy tính" name="soluong_maytinh">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL chỗ ngồi đọc sách" name="soluong_cho_ngoi_doc_sach">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL sách" name="soluong_sach">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL tạp chí" name="soluong_tapchi">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL sách điện tử" name="soluong_sach_dien_tu">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL tạp chí điện tử" name="soluong_tapchi_dien_tu">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL TV liên kết trong nước" name="soluong_thu_vien_lien_ket_trong_nuoc">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL TV điện tử LK nước ngoài" name="soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Tình trạng CSVC" name="tinhtrangcsvc">
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
                            <Form.Item style={{ marginBottom: 8 }} label="SL đầu sách" name="soluong_dau_sach">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL đầu tạp chí" name="soluong_dau_tap_chi">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL đầu sách điện tử" name="soluong_dau_sach_dien_tu">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="SL đầu tạp chí điện tử" name="soluong_dau_tap_chi_dien_tu">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Sách ĐT có truy cập trực tuyến" name="so_dau_sach_dien_tu_co_truy_cap_truc_tuyen">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Sách có bản in" name="so_dau_sach_co_ban_in">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Sách in có thể mượn trực tiếp" name="so_dau_sach_in_co_the_muon_truc_tiep">
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

export default ThuvienModal;
