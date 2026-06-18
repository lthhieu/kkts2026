'use client'
import { handleExportThietbiV2 } from '@/app/(main)/quan-tri/thiet-biv2/actions';
import { typeArr } from '@/components/thietbiv2/table';
import { Button, message, Modal, notification, Form, Select } from 'antd';
import React, { useMemo } from 'react';

interface IProps {
    access_token?: string,
    isModalExportOpen: boolean,
    setIsModalExportOpen: (value: boolean) => void,
    units: IUnit[],
}

const Context = React.createContext({ name: 'Default' });

const ModalExport = (props: IProps) => {

    const { isModalExportOpen, setIsModalExportOpen, access_token, units } = props
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
        const { type, unit } = values

        const blob = await handleExportThietbiV2(access_token ?? '', type, unit)

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-${unit}.csv`;
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
                title="Export dữ liệu thiết bị"
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
                    name="export-devicev2-modal"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        label="Đơn vị"
                        name="unit"
                        rules={[{ required: true }]}
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
                    <Form.Item
                        label="Loại thiết bị"
                        name="type"
                        rules={[{ required: true }]}
                    >
                        <Select
                            style={{ width: '100%' }}
                            showSearch={{ optionFilterProp: 'label' }}
                            placeholder="Vui lòng chọn loại thiết bị"
                            options={typeArr}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Context.Provider>
    );
};

export default ModalExport;