'use client'
import { Form, InputNumber, Modal, Select, Space, Typography, message, notification } from 'antd';
import React, { useMemo, useState } from 'react';
import { handleCreateSnapshot, handleDeleteSnapshot } from '@/app/(main)/quan-tri/kiem-ke/actions';
interface IProps {
    access_token?: string,
    isModalDeleteSnapshotOpen: boolean,
    setIsModalDeleteSnapshotOpen: (value: boolean) => void,
    yearsArr: IGetYearSnapshot | any,
}
const HandleDescript = ({ message }: { message: string }) => {
    return (
        <Space vertical>
            <Typography.Text>{message}</Typography.Text>
        </Space>
    )
}
const Context = React.createContext({ name: 'Default' });
const ModalDeleteSnapshot = (props: IProps) => {
    const { setIsModalDeleteSnapshotOpen, isModalDeleteSnapshotOpen, access_token, yearsArr } = props
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
        setIsModalDeleteSnapshotOpen(false);
    };

    const [form] = Form.useForm()
    const onFinish = async (values: any) => {
        // console.log('Received values of form: ', values.year);
        const response = await handleDeleteSnapshot(values.year, access_token ?? '')

        if (response.data) {
            api.success({
                title: `Xóa sổ kiểm kê thành công`,
                description: <HandleDescript message={response.data.message} />,
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
                title={"Xóa sổ kiểm kê"}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalDeleteSnapshotOpen}
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
                <Form
                    form={form}
                    autoComplete="off"
                    layout='vertical'
                    name="snapshot-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        style={{ marginBottom: 8, width: '100%' }}
                        label="Năm chốt sổ"
                        name="year"
                        rules={[{ required: true }]}
                    >
                        <Select
                            style={{}}
                            showSearch={{ optionFilterProp: 'label' }}
                            placeholder="Vui lòng chọn năm kiểm kê"
                            allowClear
                            options={yearsArr.years}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default ModalDeleteSnapshot;