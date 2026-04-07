'use client'
import { Modal, Form, message, Select, Row, Col, InputNumber, Input, notification } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { handleCreateOrUpdatePtn } from '@/app/(main)/quan-tri/csvc/ptn/actions';

interface IProps {
    access_token?: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    status: string;
    setStatus: (value: string) => void;
    dataUpdate: null | IPtn;
    setDataUpdate: (value: null | IPtn) => void;
    ctk: ICtk[];
    loaiptn: ILoaiptn[];
    linhvucdaotao: ILinhvucdaotao[];
}

const Context = React.createContext({ name: 'Default' });

const PtnModal = (props: IProps) => {
    const {
        setIsModalOpen, isModalOpen, setStatus, status, access_token,
        setDataUpdate, dataUpdate,
        ctk, loaiptn, linhvucdaotao,
    } = props;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                ma_ct_csvc: dataUpdate.ma_ct_csvc?._id ?? null,
                loai_ptn: dataUpdate.loai_ptn?._id ?? null,
                phuc_vu_nganh: dataUpdate.phuc_vu_nganh?._id ?? null,
                muc_do_dap_ung_nhu_cau_nckh: dataUpdate.muc_do_dap_ung_nhu_cau_nckh,
                nam_sd: dataUpdate.nam_sd,
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
        const response = await handleCreateOrUpdatePtn(values, access_token ?? '', status, dataUpdate);
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
                title={status === 'CREATE' ? 'Thêm phòng thí nghiệm' : 'Cập nhật phòng thí nghiệm'}
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
                    name="ptn-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    initialValues={{ nam_sd: new Date().getFullYear() }}
                >
                    <Form.Item style={{ marginBottom: 8 }} label="Công trình CSVC" name="ma_ct_csvc" rules={[{ required: true }]}>
                        <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                            options={ctk.map(({ _id, ten_ct }) => ({ value: _id, label: ten_ct }))} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Loại PTN" name="loai_ptn">
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={loaiptn.map(({ _id, name }) => ({ value: _id, label: name }))} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Phục vụ ngành" name="phuc_vu_nganh">
                                <Select allowClear showSearch={{ optionFilterProp: 'label' }} placeholder="Vui lòng chọn"
                                    options={linhvucdaotao.map(({ _id, name }) => ({ value: _id, label: name }))} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Mức độ đáp ứng nhu cầu NCKH" name="muc_do_dap_ung_nhu_cau_nckh">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginBottom: 8 }} label="Năm sử dụng" name="nam_sd">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default PtnModal;
