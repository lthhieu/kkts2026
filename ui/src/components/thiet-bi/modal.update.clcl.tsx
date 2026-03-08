'use client'
import { Form, InputNumber, Modal, Space, Typography, message, notification } from 'antd';
import { handleUpdateManyDevice } from '@/app/(main)/quan-tri/thiet-bi/actions';
import React, { useMemo, useState } from 'react';
interface IProps {
    access_token?: string,
    isModalUpdateManyOpen: boolean,
    setIsModalUpdateManyOpen: (value: boolean) => void,
}
const HandleDescript = ({ matched, updated }: { matched: number, updated: number }) => {
    return (
        <Space vertical>
            <Typography.Text>Tổng số lượng thiết bị tìm thấy: <strong>{matched}</strong></Typography.Text>
            <Typography.Text>Tổng số lượng thiết bị được cập nhật: <strong>{updated}</strong></Typography.Text>
        </Space>
    )
}
const Context = React.createContext({ name: 'Default' });
const ModalUpdateMany = (props: IProps) => {
    const { setIsModalUpdateManyOpen, isModalUpdateManyOpen, access_token } = props
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [confirmLoading, setConfirmLoading] = useState(false);


    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {

            form.submit();
            setConfirmLoading(false);
        }, 1000)
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalUpdateManyOpen(false);
    };

    const [form] = Form.useForm()
    const onFinish = async (values: any) => {
        // console.log('Received values of form: ', values.year);

        const response = await handleUpdateManyDevice(values.year, access_token ?? '')

        if (response.data) {
            api.success({
                title: `Cập nhật chất lượng còn lại thiết bị thành công`,
                description: <HandleDescript updated={response.data.updated} matched={response.data.matched} />,
                placement: 'topRight',
            });
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
                title={"Cập nhật chất lượng còn lại thiết bị"}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalUpdateManyOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Đồng ý"}
                cancelText={"Hủy"}
                confirmLoading={confirmLoading}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '30%',
                }}
            >
                <Typography style={{ marginBottom: 8, fontStyle: 'italic' }}>Thao tác này sẽ cập nhật chất lượng còn lại của toàn bộ thiết bị trên hệ thống dựa theo năm hiện tại, năm đưa vào sử dụng và tỷ lệ khấu hao của từng thiết bị</Typography>
                <Form
                    form={form}
                    autoComplete="off"
                    layout='vertical'
                    name="device-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    initialValues={
                        {
                            "year": new Date().getFullYear(),
                        }
                    }
                >
                    <Form.Item
                        style={{ marginBottom: 8, width: '100%' }}
                        label="Năm cập nhật"
                        name="year"
                        rules={[{ required: true }]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default ModalUpdateMany;