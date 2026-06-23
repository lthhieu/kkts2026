"use client"
import { handleCreateOrUpdateChungtu } from '@/app/(main)/quan-tri/chung-tu/actions';
import { Modal, Form, Input, message, notification, Row, Col, DatePicker, Select, InputNumber } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import VNnum2words from 'vn-num2words';
interface IProps {
    access_token?: string,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    status: string,
    setStatus: (value: string) => void,
    //update
    dataUpdate: null | IChungtu,
    setDataUpdate: (value: null | IChungtu) => void
}

const Context = React.createContext({ name: 'Default' });

const normalizeText = (text: string) => {
    // bỏ khoảng trắng thừa
    text = text.replace(/\s+/g, ' ').trim();

    // viết hoa chữ cái đầu
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const statusChungtuArray = [
    { value: 'Chưa xác định', label: 'Chưa xác định' },
    { value: 'Đã thanh toán nhưng chưa scan', label: 'Đã thanh toán nhưng chưa scan' },
    { value: 'Đã thanh toán', label: 'Đã thanh toán' },
    { value: 'Thanh toán một phần', label: 'Thanh toán một phần' }
]

const ChungtuModal = (props: IProps) => {
    const { setIsModalOpen, isModalOpen, setStatus, status, access_token, setDataUpdate, dataUpdate } = props
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                noidung: dataUpdate.noidung,
                ngaynhan: dataUpdate.ngaynhan
                    ? dayjs(dataUpdate.ngaynhan)
                    : null,

                ngayhoanthanh: dataUpdate.ngayhoanthanh
                    ? dayjs(dataUpdate.ngayhoanthanh)
                    : null,
                sotien: dataUpdate.sotien,
                trangthai: dataUpdate.trangthai,
                ghichu: dataUpdate.ghichu,
                tienbangchu: dataUpdate.tienbangchu,
                _id: dataUpdate._id,
            })
        }
    }, [dataUpdate])

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setStatus("")
        setDataUpdate(null)
        setIsModalOpen(false);
    };

    const onFinish = async (values: IChungtu) => {
        const { noidung, ngaynhan, ngayhoanthanh, sotien, trangthai, ghichu, tienbangchu } = values
        const data = {
            noidung, sotien, trangthai, ghichu, tienbangchu,
            ngaynhan: ngaynhan?.toDate(),
            ngayhoanthanh: ngayhoanthanh?.toDate() ?? null,
        }
        const response = await handleCreateOrUpdateChungtu(data, access_token ?? '', status, dataUpdate)

        if (response.data) {
            messageApi.success(response.message);
            handleCancel()
        } else {
            api.error({
                title: `Có lỗi xảy ra`,
                description: response.message,
                placement: 'topRight',
            });
        }
    }

    const validateMessages = {
        required: '${label} không được để trống',
    }

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={status === "CREATE" ? "Thêm Chứng từ" : "Cập nhật Chứng từ"}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Đồng ý"}
                cancelText={"Hủy"}
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
                    layout='vertical'
                    name="chungtu-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    initialValues={
                        {
                            "trangthai": statusChungtuArray[0].value
                        }
                    }
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Ngày nhận CT"
                                name="ngaynhan"
                                rules={[{ required: true }]}
                            >
                                <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
                            </Form.Item>

                        </Col>

                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Tên hoàn thành CT"
                                name="ngayhoanthanh"
                            >
                                <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Nội dung"
                        name="noidung"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea autoSize />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Trạng thái"
                                name="trangthai"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    showSearch
                                    placeholder="Vui lòng chọn trạng thái"
                                    options={statusChungtuArray}
                                />
                            </Form.Item>

                        </Col>

                        <Col span={12}>
                            <Form.Item
                                style={{ marginBottom: 8 }}
                                label="Ghi chú"
                                name="ghichu"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Số tiền"
                        name="sotien"
                        rules={[{ required: true }]}
                    >
                        <InputNumber style={{ width: '100%' }}
                            onChange={(value) => {
                                if (!value) {
                                    form.setFieldValue('tienbangchu', '');
                                    return;
                                }

                                const tienBangChu = normalizeText(
                                    `${VNnum2words(Number(value))} đồng`
                                );

                                form.setFieldValue('tienbangchu', tienBangChu);
                            }} />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 8 }}
                        label="Tiền bằng chữ"
                        name="tienbangchu"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default ChungtuModal;