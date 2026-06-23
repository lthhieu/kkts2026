'use client'
import { handleExportChungtu } from '@/app/(main)/quan-tri/chung-tu/actions';
import { Button, message, Modal, notification, Form, Select, InputNumber } from 'antd';
import React, { useMemo } from 'react';

interface IProps {
    access_token?: string,
    isModalExportOpen: boolean,
    setIsModalExportOpen: (value: boolean) => void,
}

const Context = React.createContext({ name: 'Default' });
const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
}));

const ModalExport = (props: IProps) => {

    const { isModalExportOpen, setIsModalExportOpen, access_token } = props
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [form] = Form.useForm()
    const showModal = () => {
        setIsModalExportOpen(true);
    };

    const handleOk = () => {
        form.submit();
        // setIsModalExportOpen(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalExportOpen(false);
    };

    const onFinish = async (values: any) => {
        const { month, year } = values

        const blob = await handleExportChungtu(access_token ?? '', month, year)

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `chungtu.csv`;
        a.click();

        window.URL.revokeObjectURL(url);
        form.resetFields();
        setIsModalExportOpen(false);
    }

    const validateMessages = {
        required: '${label} không được để trống',
    }

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title="Export dữ liệu chứng từ"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalExportOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Đồng ý"}
                cancelText={"Hủy"}
            >
                <Form
                    form={form}
                    autoComplete="off"
                    layout='vertical'
                    name="export-chungtu-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        label="Tháng"
                        name="month"
                    >
                        <Select
                            style={{ width: '100%' }}
                            showSearch={{ optionFilterProp: 'label' }}
                            placeholder="Vui lòng chọn tháng"
                            options={months}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Năm"
                        name="year"
                        rules={[{ required: true }]}
                    >
                        <InputNumber placeholder='Vui lòng chọn năm' style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default ModalExport;